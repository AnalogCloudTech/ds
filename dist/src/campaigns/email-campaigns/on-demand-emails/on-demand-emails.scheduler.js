"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnDemandEmailsScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const on_demand_emails_service_1 = require("./on-demand-emails.service");
const luxon_1 = require("luxon");
const types_1 = require("./domain/types");
const lodash_1 = require("lodash");
const contexts_1 = require("../../../internal/common/contexts");
const afy_notifications_service_1 = require("../../../integrations/afy-notifications/afy-notifications.service");
const templates_service_1 = require("../templates/templates.service");
const on_demand_email_schema_1 = require("./schemas/on-demand-email.schema");
const filters_1 = require("../leads/utils/filters");
const types_2 = require("../leads/domain/types");
const leads_service_1 = require("../leads/leads.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ses_service_1 = require("../../../internal/libs/aws/ses/ses.service");
const replaceTags_1 = require("../../../internal/utils/aws/ses/replaceTags");
const check_status_of_email_message_exception_1 = require("../../../integrations/afy-notifications/exceptions/check-status-of-email-message.exception");
let OnDemandEmailsScheduler = class OnDemandEmailsScheduler {
    constructor(onDemandEmailModel, service, templatesService, leadsService, sesService, afyNotificationsService, logger) {
        this.onDemandEmailModel = onDemandEmailModel;
        this.service = service;
        this.templatesService = templatesService;
        this.leadsService = leadsService;
        this.sesService = sesService;
        this.afyNotificationsService = afyNotificationsService;
        this.logger = logger;
    }
    async generateOnDemandEmails(onDemandEmails) {
        const emailMessages = [];
        const errors = [];
        await Promise.all(onDemandEmails.map(async (onDemandEmail) => {
            try {
                const { templateId, customer, subject } = onDemandEmail;
                const { email: sender, attributes } = customer;
                const leads = await this.getOnDemandEmailLeads(onDemandEmail);
                if (!(leads === null || leads === void 0 ? void 0 : leads.length)) {
                    await this.updateStatus(onDemandEmail._id, types_1.Statuses.NO_LEADS);
                }
                const templateData = await this.templatesService.templateDetails(templateId);
                leads.map((lead) => {
                    const { email } = lead;
                    emailMessages.push({
                        provider: 'aws',
                        from: (attributes === null || attributes === void 0 ? void 0 : attributes.email) || sender,
                        to: email,
                        subject,
                        html: this.getHtmlFromLead(lead, templateData.content, attributes),
                    });
                });
            }
            catch (err) {
                errors.push(err);
            }
        }));
        return emailMessages;
    }
    async handleCron() {
        var _a, e_1, _b, _c;
        const onDemandEmails = await this.service.getEmailsByStatusAndDate(types_1.Statuses.STATUS_SCHEDULED, luxon_1.DateTime.now().toISO());
        if ((0, lodash_1.get)(onDemandEmails, 'length')) {
            try {
                for (var _d = true, onDemandEmails_1 = __asyncValues(onDemandEmails), onDemandEmails_1_1; onDemandEmails_1_1 = await onDemandEmails_1.next(), _a = onDemandEmails_1_1.done, !_a;) {
                    _c = onDemandEmails_1_1.value;
                    _d = false;
                    try {
                        const onDemandEmailDocument = _c;
                        const { _id: id } = onDemandEmailDocument;
                        const data = await this.generateOnDemandEmails(onDemandEmails);
                        try {
                            await this.service.updateStatus(id, types_1.Statuses.STATUS_IN_PROGRESS);
                            const messagesId = await this.afyNotificationsService.sendEmail(data);
                            await this.service.updateMessageIds(id, messagesId);
                        }
                        catch (err) {
                            if (err instanceof Error) {
                                const { name, stack, message } = err;
                                this.logger.error({
                                    payload: {
                                        usageDate: luxon_1.DateTime.now(),
                                        name,
                                        stack,
                                        message,
                                        onDemandEmail: id,
                                    },
                                }, '', contexts_1.CONTEXT_ON_DEMAND_EMAIL_ERROR);
                            }
                        }
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = onDemandEmails_1.return)) await _b.call(onDemandEmails_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    }
    async checkStatus() {
        const filter = {
            status: types_1.Statuses.STATUS_IN_PROGRESS,
        };
        const onDemandEmails = await this.service.find(filter);
        await Promise.all(onDemandEmails.map(async (onDemandEmail) => {
            try {
                const messageIds = onDemandEmail.messageIds.filter((id) => id);
                if (messageIds.length === 0) {
                    return;
                }
                const status = await this.afyNotificationsService.checkStatusOf(messageIds);
                if (status) {
                    await this.service.updateStatus(onDemandEmail._id, types_1.Statuses.STATUS_DONE);
                }
            }
            catch (error) {
                if (error instanceof check_status_of_email_message_exception_1.CheckStatusOfEmailMessageException) {
                    const { name, stack, message } = error;
                    this.logger.error({
                        payload: {
                            usageDate: luxon_1.DateTime.now(),
                            name,
                            stack,
                            message,
                            onDemandEmail: onDemandEmail._id,
                            exception: 'CheckStatusOfEmailMessageException',
                        },
                    }, stack, contexts_1.CONTEXT_ON_DEMAND_EMAIL_ERROR);
                }
            }
        }));
    }
    getHtmlFromLead(lead, template, attributes) {
        const { email, firstName, lastName } = lead;
        const templateData = {
            LEAD_FIRST_NAME: firstName,
            LEAD_LAST_NAME: lastName,
            LEAD_EMAIL: email,
            LEAD_UNSUBSCRIBE_URL: this.sesService.generateRouteForUnsubscribe(lead._id.toString()),
            BROKER_ADDRESS: (attributes === null || attributes === void 0 ? void 0 : attributes.brokerAddress) || '',
            PROFILE_IMAGE: (attributes === null || attributes === void 0 ? void 0 : attributes.imageUrl) || '',
            MEMBER_FIRST_NAME: (attributes === null || attributes === void 0 ? void 0 : attributes.memberFirstName) || '',
            MEMBER_LAST_NAME: (attributes === null || attributes === void 0 ? void 0 : attributes.memberLastName) || '',
            MEMBER_TITLE: (attributes === null || attributes === void 0 ? void 0 : attributes.memberTitle) || '',
            MEMBER_BROKER_NAME: (attributes === null || attributes === void 0 ? void 0 : attributes.memberBrokerName) || '',
            MEMBER_ADDRESS: (attributes === null || attributes === void 0 ? void 0 : attributes.memberAddress) || '',
            MEMBER_PHONE: (attributes === null || attributes === void 0 ? void 0 : attributes.memberPhone) || '',
            MEMBER_PROFILE_IMAGE: (attributes === null || attributes === void 0 ? void 0 : attributes.memberProfileImage) || '',
            MEMBER_EMAIL: (attributes === null || attributes === void 0 ? void 0 : attributes.memberEmail) || '',
            MEMBER_BOOK_URL: (attributes === null || attributes === void 0 ? void 0 : attributes.memberBookUrl) || '',
        };
        return (0, replaceTags_1.replaceTagsOnDemandEmails)(template, templateData);
    }
    async getOnDemandEmailLeads(onDemandEmail) {
        const { _id: customerId, email: customerEmail } = (onDemandEmail.customer);
        const { segments, allSegments } = onDemandEmail;
        const filters = (0, filters_1.buildFilterQueryForCampaignLeads)(customerId, customerEmail, segments, allSegments);
        return this.leadsService.getAllFromFilter(filters, types_2.UsageFields.ON_DEMAND_EMAIL);
    }
    async updateStatus(onDemandEmailId, status) {
        return this.onDemandEmailModel
            .findByIdAndUpdate(onDemandEmailId, { status }, { new: true })
            .exec();
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OnDemandEmailsScheduler.prototype, "handleCron", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OnDemandEmailsScheduler.prototype, "checkStatus", null);
OnDemandEmailsScheduler = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(on_demand_email_schema_1.OnDemandEmail.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        on_demand_emails_service_1.OnDemandEmailsService,
        templates_service_1.TemplatesService,
        leads_service_1.LeadsService,
        ses_service_1.SesService,
        afy_notifications_service_1.AfyNotificationsService,
        common_1.Logger])
], OnDemandEmailsScheduler);
exports.OnDemandEmailsScheduler = OnDemandEmailsScheduler;
//# sourceMappingURL=on-demand-emails.scheduler.js.map
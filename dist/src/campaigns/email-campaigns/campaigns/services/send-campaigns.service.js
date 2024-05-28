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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendCampaignsService = void 0;
const common_1 = require("@nestjs/common");
const campaigns_service_1 = require("./campaigns.service");
const lodash_1 = require("lodash");
const customers_service_1 = require("../../../../customers/customers/customers.service");
const ses_service_1 = require("../../../../internal/libs/aws/ses/ses.service");
const types_1 = require("../../leads/domain/types");
const leads_service_1 = require("../../leads/leads.service");
const mongoose_1 = require("mongoose");
const luxon_1 = require("luxon");
const campaign_listeners_1 = require("../listeners/campaign.listeners");
const events_1 = require("../events");
const functions_1 = require("../../../../internal/utils/functions");
const types_2 = require("../domain/types");
const mongoose_2 = require("@nestjs/mongoose");
const campaign_history_schema_1 = require("../schemas/campaign-history.schema");
const event_emitter_1 = require("@nestjs/event-emitter");
const contents_service_1 = require("../../contents/contents.service");
const types_3 = require("../../email-history/schemas/types");
const email_history_service_1 = require("../../email-history/email-history.service");
const campaign_repository_1 = require("../repositories/campaign.repository");
const date_1 = require("../../../../internal/utils/date");
const contexts_1 = require("../../../../internal/common/contexts");
const filters_1 = require("../../leads/utils/filters");
const afy_notifications_service_1 = require("../../../../integrations/afy-notifications/afy-notifications.service");
const replaceTags_1 = require("../../../../internal/utils/aws/ses/replaceTags");
const campaign_without_available_leads_exception_1 = require("../Exceptions/campaign-without-available-leads.exception");
const campaign_without_available_emails_exception_1 = require("../Exceptions/campaign-without-available-emails.exception");
const types_4 = require("../../../../customers/customers/domain/types");
let SendCampaignsService = class SendCampaignsService {
    constructor(campaignsService, customersService, sesService, leadsService, contentsService, emailHistoryService, campaignsRepository, campaignHistoryModel, eventEmitter, afyNotificationsService, logger) {
        this.campaignsService = campaignsService;
        this.customersService = customersService;
        this.sesService = sesService;
        this.leadsService = leadsService;
        this.contentsService = contentsService;
        this.emailHistoryService = emailHistoryService;
        this.campaignsRepository = campaignsRepository;
        this.campaignHistoryModel = campaignHistoryModel;
        this.eventEmitter = eventEmitter;
        this.afyNotificationsService = afyNotificationsService;
        this.logger = logger;
    }
    async sendCampaign(customerEmail, templateName, leads) {
        const customer = await this.customersService.findByEmail(customerEmail);
        const sourceEmail = (0, lodash_1.get)(customer, ['attributes', 'email']);
        const attributes = (0, lodash_1.get)(customer, ['attributes']);
        const params = this.sesService.buildParamsFromLeads(sourceEmail, templateName, leads, attributes);
        return this.sesService.sendBulkTemplatedEmail(params);
    }
    async setLeadsUsage(leads) {
        return this.leadsService.setLeadsUsage(leads, types_1.UsageFields.EMAIL_CAMPAIGN);
    }
    async sendAbsoluteCampaign(campaign) {
        const customer = campaign.customer;
        const content = await this.contentsService.detailsRaw(campaign.contentId);
        const now = luxon_1.DateTime.now();
        const month = now.month;
        const day = now.day;
        const emails = (0, lodash_1.filter)(content.attributes.emails, ({ usesRelativeTime, absoluteDay, absoluteMonth }) => {
            return (!usesRelativeTime && absoluteDay === day && absoluteMonth === month);
        });
        this.logger.log({
            payload: {
                usageDate: luxon_1.DateTime.now(),
                message: `List of emails for ${campaign._id}`,
                emails,
            },
        }, contexts_1.CONTEXT_EMAIL_CAMPAIGNS_DEBUG);
        const leads = await this.getCampaignLeads(campaign);
        this.logger.log({
            payload: {
                usageDate: luxon_1.DateTime.now(),
                message: `List of leads for ${campaign._id}`,
                leads: leads === null || leads === void 0 ? void 0 : leads.map((lead) => {
                    return {
                        id: lead._id,
                        email: lead.email,
                        name: lead.firstName,
                    };
                }),
            },
        }, contexts_1.CONTEXT_EMAIL_CAMPAIGNS_DEBUG);
        this.handleEvents(campaign, emails, leads);
        const messageIds = [];
        const templateNames = [];
        const leadsToUpdate = [];
        for (const email of emails) {
            const { template } = this.getCustomTemplateIfExists(email, customer);
            const processedData = await this.processCampaignForChunkedLeads(leads, customer, template);
            messageIds.push(...processedData.emailMessageIds);
            this.logger.log({
                payload: {
                    usageDate: luxon_1.DateTime.now(),
                    message: `AWS Response ${campaign._id}`,
                    processedData,
                },
            }, contexts_1.CONTEXT_EMAIL_CAMPAIGNS_DEBUG);
            leadsToUpdate.push(...processedData.leadsToUpdate);
        }
        if (!(0, lodash_1.isEmpty)(messageIds)) {
            await this.campaignsService.update(campaign._id, {
                $push: {
                    messageIds,
                },
            });
        }
        if (!(0, lodash_1.isEmpty)(leadsToUpdate)) {
            await this.setLeadsUsage(leadsToUpdate);
            for (const lead of leadsToUpdate) {
                await this.createHistory(campaign, lead);
            }
        }
    }
    async sendRelativeCampaign(campaign) {
        const customer = campaign.customer;
        const content = await this.contentsService.detailsRaw(campaign.contentId);
        const emails = (0, lodash_1.filter)(content.attributes.emails, ({ usesRelativeTime }) => usesRelativeTime);
        this.logger.log({
            payload: {
                usageDate: luxon_1.DateTime.now(),
                message: `List of emails for ${campaign._id}`,
                emails,
            },
        }, contexts_1.CONTEXT_EMAIL_CAMPAIGNS_DEBUG);
        const leads = await this.getCampaignLeads(campaign);
        this.logger.log({
            payload: {
                usageDate: luxon_1.DateTime.now(),
                message: `List of leads for ${campaign._id}`,
                leads: leads === null || leads === void 0 ? void 0 : leads.map((lead) => {
                    return {
                        id: lead._id,
                        email: lead.email,
                        name: lead.firstName,
                    };
                }),
            },
        }, contexts_1.CONTEXT_EMAIL_CAMPAIGNS_DEBUG);
        this.handleEvents(campaign, emails, leads);
        const messageIds = [];
        const templateNames = [];
        const leadsToUpdate = [];
        for (const email of emails) {
            const { template } = this.getCustomTemplateIfExists(email, customer);
            const { relativeDays } = email;
            const relativeLeads = leads.filter((lead) => {
                return relativeDays === (0, date_1.diffInDaysFromToday)(lead.createdAt);
            });
            if ((0, lodash_1.isEmpty)(relativeLeads)) {
                this.eventEmitter.emit(campaign_listeners_1.CampaignEvents.NO_LEADS, new events_1.CampaignNoLeadsEvent(campaign));
            }
            const processedData = await this.processCampaignForChunkedLeads(relativeLeads, customer, template);
            messageIds.push(...processedData.emailMessageIds);
            this.logger.log({
                payload: {
                    usageDate: luxon_1.DateTime.now(),
                    message: `AWS Response ${campaign._id}`,
                    processedData,
                },
            }, contexts_1.CONTEXT_EMAIL_CAMPAIGNS_DEBUG);
            leadsToUpdate.push(...processedData.leadsToUpdate);
        }
        if (!(0, lodash_1.isEmpty)(messageIds)) {
            await this.campaignsService.update(campaign._id, {
                $push: {
                    messageIds,
                },
            });
        }
        if (!(0, lodash_1.isEmpty)(leadsToUpdate)) {
            await this.setLeadsUsage(leadsToUpdate);
            for (const lead of leadsToUpdate) {
                await this.createHistory(campaign, lead);
            }
        }
    }
    async sendAllCampaignsByHandler(campaigns, handler) {
        this.logger.log({
            payload: {
                usageDate: luxon_1.DateTime.now(),
                message: `Sending ${handler} campaigns start`,
            },
        }, contexts_1.CONTEXT_EMAIL_CAMPAIGNS_DEBUG);
        if ((0, lodash_1.isEmpty)(campaigns)) {
            this.logger.log({
                payload: {
                    usageDate: luxon_1.DateTime.now(),
                    message: 'No campaigns to send',
                },
            }, contexts_1.CONTEXT_EMAIL_CAMPAIGNS_DEBUG);
            return;
        }
        for (const campaign of campaigns) {
            try {
                this.logger.log({
                    payload: {
                        usageDate: luxon_1.DateTime.now(),
                        campaignId: campaign._id,
                        message: `Campaign ${campaign._id} sent start`,
                    },
                }, contexts_1.CONTEXT_EMAIL_CAMPAIGNS_DEBUG);
                await this[handler](campaign);
                this.logger.log({
                    payload: {
                        usageDate: luxon_1.DateTime.now(),
                        campaignId: campaign._id,
                        message: `Campaign ${campaign._id} sent end`,
                    },
                }, contexts_1.CONTEXT_EMAIL_CAMPAIGNS_DEBUG);
            }
            catch (exception) {
                const exceptionIsInstanceOf = exception instanceof campaign_without_available_leads_exception_1.CampaignWithoutAvailableLeadsException ||
                    exception instanceof campaign_without_available_emails_exception_1.CampaignWithoutAvailableEmailsException;
                const shouldLog = !exceptionIsInstanceOf && exception instanceof Error;
                if (shouldLog) {
                    const customer = campaign.customer;
                    const payload = {
                        campaignId: campaign._id.toString(),
                        customerId: customer._id.toString(),
                        customerName: `${customer.firstName} ${customer.lastName}`,
                        customerEmail: customer.email,
                        exception,
                        usageDate: luxon_1.DateTime.now(),
                    };
                    this.logger.error({ payload }, exception === null || exception === void 0 ? void 0 : exception.stack, contexts_1.CONTEXT_EMAIL_CAMPAIGNS_ERROR);
                }
            }
            finally {
                this.logger.log({
                    payload: {
                        usageDate: luxon_1.DateTime.now(),
                        message: `Sending ${handler} campaigns end`,
                    },
                }, contexts_1.CONTEXT_EMAIL_CAMPAIGNS_DEBUG);
                await (0, functions_1.sleep)(1000);
            }
        }
    }
    async processCampaignForChunkedLeads(leads, customer, template) {
        const leadsToUpdate = [];
        const emailMessages = leads.map((lead) => {
            leadsToUpdate.push(lead);
            return {
                from: customer.attributes.email,
                to: lead.email,
                subject: this.getHtmlFromLead(lead, template.attributes.subject, customer.attributes),
                html: this.getHtmlFromLead(lead, template.attributes.content, customer.attributes),
                provider: 'aws',
            };
        });
        const emailMessageIds = [];
        for (const emailMessage of emailMessages) {
            const id = await this.afyNotificationsService.sendEmail([emailMessage]);
            emailMessageIds.push(...id);
            await (0, functions_1.sleep)(50);
        }
        return { leadsToUpdate, emailMessageIds };
    }
    async createCampaignHistory(campaign, templateNames, messageIds, type) {
        const history = new this.campaignHistoryModel({
            campaign: campaign._id,
            templateNames,
            messageIds,
            type,
        });
        return history.save();
    }
    async getCampaignLeads(campaign) {
        const { allSegments, customer, segments } = campaign;
        const { _id: customerId, email: customerEmail } = (customer);
        const filters = (0, filters_1.buildFilterQueryForCampaignLeads)(customerId, customerEmail, segments, allSegments);
        return this.leadsService.getAllFromFilter(filters);
    }
    async createHistory(campaign, lead) {
        const dto = {
            lead: (0, lodash_1.get)(lead, '_id'),
            relationId: (0, lodash_1.get)(campaign, '_id'),
            relationType: types_3.RelationTypes.CAMPAIGNS,
        };
        return this.emailHistoryService.addHistoryFromOnDemandEmail(dto);
    }
    async getCampaignsToBeSent() {
        const filter = {
            status: types_2.CampaignStatus.ACTIVE,
            startDate: { $lte: luxon_1.DateTime.now() },
        };
        const options = {
            populate: ['customer'],
        };
        const campaigns = await this.campaignsRepository.findAll(filter, options);
        return campaigns.filter((c) => { var _a; return ((_a = c === null || c === void 0 ? void 0 : c.customer) === null || _a === void 0 ? void 0 : _a.status) === types_4.Status.ACTIVE; });
    }
    handleEvents(campaign, emails, leads) {
        if ((0, lodash_1.isEmpty)(emails)) {
            this.eventEmitter.emit(campaign_listeners_1.CampaignEvents.NO_EMAILS, new events_1.CampaignNoEmailsEvent(campaign));
        }
        if ((0, lodash_1.isEmpty)(leads)) {
            this.eventEmitter.emit(campaign_listeners_1.CampaignEvents.NO_LEADS, new events_1.CampaignNoLeadsEvent(campaign));
        }
    }
    getCustomTemplateIfExists(email, customer) {
        var _a;
        let isCustom = false;
        let template = (_a = email.template.data.attributes.emailTemplates) === null || _a === void 0 ? void 0 : _a.data.find((template) => template.attributes.customerId === customer._id.toString());
        if (template) {
            isCustom = true;
        }
        else {
            template = email.template.data;
        }
        return { template, isCustom };
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
};
SendCampaignsService = __decorate([
    (0, common_1.Injectable)(),
    __param(7, (0, mongoose_2.InjectModel)(campaign_history_schema_1.CampaignHistory.name)),
    __metadata("design:paramtypes", [campaigns_service_1.CampaignsService,
        customers_service_1.CustomersService,
        ses_service_1.SesService,
        leads_service_1.LeadsService,
        contents_service_1.ContentsService,
        email_history_service_1.EmailHistoryService,
        campaign_repository_1.CampaignRepository,
        mongoose_1.Model,
        event_emitter_1.EventEmitter2,
        afy_notifications_service_1.AfyNotificationsService,
        common_1.Logger])
], SendCampaignsService);
exports.SendCampaignsService = SendCampaignsService;
//# sourceMappingURL=send-campaigns.service.js.map
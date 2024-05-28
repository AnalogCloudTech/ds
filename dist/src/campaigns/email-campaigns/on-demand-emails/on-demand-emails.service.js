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
exports.OnDemandEmailsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const on_demand_email_schema_1 = require("./schemas/on-demand-email.schema");
const types_1 = require("./domain/types");
const luxon_1 = require("luxon");
const paginator_1 = require("../../../internal/utils/paginator");
const templates_service_1 = require("../templates/templates.service");
const leads_service_1 = require("../leads/leads.service");
const segments_service_1 = require("../segments/segments.service");
const types_2 = require("../leads/domain/types");
const lodash_1 = require("lodash");
const ses_service_1 = require("../../../internal/libs/aws/ses/ses.service");
const constants_1 = require("../../../internal/libs/aws/ses/constants");
const email_history_service_1 = require("../email-history/email-history.service");
const types_3 = require("../email-history/schemas/types");
const contexts_1 = require("../../../internal/common/contexts");
const filters_1 = require("../leads/utils/filters");
let OnDemandEmailsService = class OnDemandEmailsService {
    constructor(onDemandEmailModel, templatesService, leadsService, segmentsService, sesService, emailHistoryService, logger) {
        this.onDemandEmailModel = onDemandEmailModel;
        this.templatesService = templatesService;
        this.leadsService = leadsService;
        this.segmentsService = segmentsService;
        this.sesService = sesService;
        this.emailHistoryService = emailHistoryService;
        this.logger = logger;
    }
    async create(customer, createOnDemandEmailDto) {
        const template = await this.templatesService.templateDetails(createOnDemandEmailDto.templateId);
        const dto = Object.assign(Object.assign({}, createOnDemandEmailDto), { customer: customer._id, templateName: template.name });
        const createdOnDemandEmail = new this.onDemandEmailModel(dto);
        const item = await createdOnDemandEmail.save();
        return item;
    }
    async findAll(user) {
        const userEmail = user.email;
        const query = this.onDemandEmailModel.find({
            customerEmail: { $eq: userEmail },
        });
        return query.exec();
    }
    async findAllPaginated(customer, page, perPage) {
        const total = await this.onDemandEmailModel
            .find({ customer: { $eq: customer._id } })
            .countDocuments()
            .exec();
        const data = await this.onDemandEmailModel
            .find({ customer: { $eq: customer._id } })
            .sort({ createdAt: -1 })
            .exec();
        const segmentsId = [];
        (0, lodash_1.each)(data, (item) => {
            (0, lodash_1.each)(item.segments, (segmentId) => segmentsId.push(segmentId));
        });
        const dataWithSegments = await this.segmentsService.attachSegments(data, segmentsId);
        return paginator_1.PaginatorSchema.build(total, dataWithSegments, page, perPage);
    }
    async findOneByUser(customer, id) {
        const onDemandEmail = await this.onDemandEmailModel
            .findOne({
            _id: { $eq: id },
            customer: { $eq: customer._id },
        })
            .exec();
        if (!onDemandEmail) {
            throw new common_1.HttpException('Document not found', common_1.HttpStatus.NOT_FOUND);
        }
        return onDemandEmail;
    }
    async update(id, updateOnDemandEmailDto) {
        const template = await this.templatesService.templateDetails(updateOnDemandEmailDto.templateId);
        const dto = Object.assign(Object.assign({}, updateOnDemandEmailDto), { templateName: template.name });
        return this.onDemandEmailModel
            .findByIdAndUpdate(id, dto, { new: true })
            .exec();
    }
    async remove(id) {
        const removedItem = await this.onDemandEmailModel
            .findByIdAndDelete(id)
            .exec();
        return removedItem;
    }
    async getEmailsByStatusAndDate(status, dateTime) {
        const date = new Date(dateTime);
        const filter = {
            status: { $eq: status },
            scheduleDate: { $lte: date },
        };
        return this.onDemandEmailModel.find(filter).populate('customer').exec();
    }
    async updateStatus(onDemandEmailId, status) {
        return this.onDemandEmailModel
            .findByIdAndUpdate(onDemandEmailId, { status }, { new: true })
            .exec();
    }
    async setEmailAsDone(onDemandEmailId) {
        return this.onDemandEmailModel.findByIdAndUpdate(onDemandEmailId, {
            status: types_1.Statuses.STATUS_DONE,
            completionDate: luxon_1.DateTime.now(),
        });
    }
    setLeadsUsage(leads) {
        return this.leadsService.setLeadsUsage(leads, types_2.UsageFields.ON_DEMAND_EMAIL);
    }
    async updateMessageIds(onDemandEmailId, messageIds) {
        return this.onDemandEmailModel.findByIdAndUpdate(onDemandEmailId, { messageIds }, { new: true });
    }
    async sendBulkEmail(onDemandEmailDocument) {
        var _a, e_1, _b, _c;
        const leads = await this.getOnDemandEmailLeads(onDemandEmailDocument);
        if (!(0, lodash_1.get)(leads, 'length')) {
            await this.updateStatus(onDemandEmailDocument._id, types_1.Statuses.NO_LEADS);
            return null;
        }
        const { templateId } = onDemandEmailDocument;
        const customer = onDemandEmailDocument.customer;
        const { attributes } = customer;
        const templateData = await this.templatesService.templateDetails(templateId);
        const isCustom = templateData.customerId === customer._id.toString();
        const templateName = isCustom
            ? (0, constants_1.buildCustomerTemplateName)(templateId)
            : (0, constants_1.buildTemplateName)(templateId);
        const source = attributes.email;
        const messageIds = [];
        const responses = [];
        try {
            for (var _d = true, _e = __asyncValues((0, lodash_1.chunk)(leads, 50)), _f; _f = await _e.next(), _a = _f.done, !_a;) {
                _c = _f.value;
                _d = false;
                try {
                    const chunkedLeads = _c;
                    const params = this.sesService.buildParamsFromLeads(source, templateName, chunkedLeads, attributes);
                    const response = await this.sesService.sendBulkTemplatedEmail(params);
                    responses.push(response);
                    const messages = response.Status.map(({ MessageId }) => MessageId);
                    messageIds.push(...messages);
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) await _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        await Promise.all([
            this.createEmailHistory(onDemandEmailDocument, leads),
            this.updateMessageIds(onDemandEmailDocument._id, messageIds),
            this.setLeadsUsage(leads),
            this.setEmailAsDone(onDemandEmailDocument._id),
            this.sendToES(onDemandEmailDocument, leads, messageIds, templateName, customer),
        ]);
        return responses;
    }
    async canBeChanged(id) {
        try {
            const onDemandEmail = await this.onDemandEmailModel.findById(id);
            return onDemandEmail.status === types_1.Statuses.STATUS_SCHEDULED;
        }
        catch (exception) {
            return false;
        }
    }
    async findByMessageId(messageId) {
        try {
            const filter = {
                messageIds: { $in: messageId },
            };
            return this.onDemandEmailModel.findOne(filter).exec();
        }
        catch (exception) {
            return null;
        }
    }
    async getOnDemandEmailLeads(onDemandEmail) {
        const { _id: customerId, email: customerEmail } = (onDemandEmail.customer);
        const { segments, allSegments } = onDemandEmail;
        const filters = (0, filters_1.buildFilterQueryForCampaignLeads)(customerId, customerEmail, segments, allSegments);
        return this.leadsService.getAllFromFilter(filters, types_2.UsageFields.ON_DEMAND_EMAIL);
    }
    async getOnDemandEmailSegments(onDemandEmail) {
        const filters = {
            filters: {
                ids: onDemandEmail.segments,
                bookId: null,
                name: null,
            },
        };
        return this.segmentsService.list(filters);
    }
    async find(filter) {
        return this.onDemandEmailModel.find(filter).exec();
    }
    async createEmailHistory(onDemandEmailDocument, leads) {
        await Promise.all(leads.map((lead) => this.emailHistoryService.addHistoryFromOnDemandEmail({
            lead: (0, lodash_1.get)(lead, '_id'),
            relationId: onDemandEmailDocument._id,
            relationType: types_3.RelationTypes.ON_DEMAND_EMAILS,
        })));
    }
    async sendToES(onDemandEmailDocument, leads, messageIds, templateName, customer) {
        const segments = await this.getOnDemandEmailSegments(onDemandEmailDocument);
        const payload = {
            id: onDemandEmailDocument._id,
            segmentsNames: (0, lodash_1.map)(segments, (segment) => segment.name),
            messageIds,
            templateName,
            allSegments: onDemandEmailDocument.allSegments,
            customerId: (0, lodash_1.get)(customer, '_id'),
            customerFirstName: (0, lodash_1.get)(customer, 'firstName'),
            customerLastName: (0, lodash_1.get)(customer, 'lastName'),
            customerEmail: (0, lodash_1.get)(customer, 'email'),
            leadEmails: (0, lodash_1.map)(leads, (lead) => lead.email),
            usageDate: luxon_1.DateTime.now(),
        };
        this.logger.log({ payload }, contexts_1.CONTEXT_ON_DEMAND_EMAIL);
    }
};
OnDemandEmailsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(on_demand_email_schema_1.OnDemandEmail.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => templates_service_1.TemplatesService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => email_history_service_1.EmailHistoryService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        templates_service_1.TemplatesService,
        leads_service_1.LeadsService,
        segments_service_1.SegmentsService,
        ses_service_1.SesService,
        email_history_service_1.EmailHistoryService,
        common_1.Logger])
], OnDemandEmailsService);
exports.OnDemandEmailsService = OnDemandEmailsService;
//# sourceMappingURL=on-demand-emails.service.js.map
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
exports.CampaignsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lodash_1 = require("lodash");
const campaign_schema_1 = require("../schemas/campaign.schema");
const campaign_1 = require("../domain/campaign");
const paginator_1 = require("../../../../internal/utils/paginator");
const types_1 = require("../domain/types");
const contents_service_1 = require("../../contents/contents.service");
const segments_service_1 = require("../../segments/segments.service");
const campaign_history_schema_1 = require("../schemas/campaign-history.schema");
const campaign_repository_1 = require("../repositories/campaign.repository");
const email_history_service_1 = require("../../email-history/email-history.service");
const templates_service_1 = require("../../templates/templates.service");
const analytics_service_1 = require("../../../../legacy/dis/legacy/analytics/analytics.service");
const afy_notifications_service_1 = require("../../../../integrations/afy-notifications/afy-notifications.service");
const luxon_1 = require("luxon");
const email_metrics_1 = require("../../../../internal/utils/csv-formats/email-metrics");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../../constants");
let CampaignsService = class CampaignsService {
    constructor(campaignModel, campaignHistoryModel, contentsService, segmentsService, campaignRepository, emailHistoryService, templatesService, analyticsService, notificationsService, csvUploaderQueue) {
        this.campaignModel = campaignModel;
        this.campaignHistoryModel = campaignHistoryModel;
        this.contentsService = contentsService;
        this.segmentsService = segmentsService;
        this.campaignRepository = campaignRepository;
        this.emailHistoryService = emailHistoryService;
        this.templatesService = templatesService;
        this.analyticsService = analyticsService;
        this.notificationsService = notificationsService;
        this.csvUploaderQueue = csvUploaderQueue;
    }
    async getCampaigns(customer, page, perPage) {
        const customerId = customer._id;
        const total = await this.campaignModel
            .find({ customer: customerId })
            .countDocuments()
            .exec();
        const skip = page * perPage;
        const data = await this.campaignModel
            .find({ customer: customerId })
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(perPage)
            .exec();
        const segmentsId = [];
        const promises = data.map(async (item) => {
            (0, lodash_1.each)(item.segments, (segmentId) => segmentsId.push(segmentId));
            const content = await this.contentsService.details(item.contentId);
            const numberOfEmails = (0, lodash_1.get)(content, ['emails', 'length'], 0);
            return Object.assign(Object.assign({}, item.castTo(campaign_1.Campaign)), { numberOfEmails,
                content });
        });
        const castedData = await Promise.all(promises);
        const campaignWithSegments = await this.segmentsService.attachSegments(castedData, segmentsId);
        return paginator_1.PaginatorSchema.build(total, campaignWithSegments, page, perPage);
    }
    async createCampaign(customer, dto) {
        const content = await this.contentsService.detailsRaw(dto.contentId);
        const templateIds = (0, lodash_1.map)((0, lodash_1.get)(content, ['attributes', 'emails']), (email) => {
            return (0, lodash_1.get)(email, ['template', 'data', 'id']);
        });
        const data = Object.assign(Object.assign({}, dto), { customer: customer._id, templateIds });
        return this.campaignRepository.store(data);
    }
    async update(id, dto) {
        return this.campaignRepository.update(id, dto);
    }
    async updateCampaign(id, dto) {
        return this.campaignRepository.update(id, dto);
    }
    async updateCampaignStatus(id, dto) {
        return this.campaignRepository.update(id, dto);
    }
    async getCampaign(customer, id) {
        const campaign = await this.campaignModel
            .findOne({ customer: { $eq: customer._id }, _id: { $eq: id } })
            .exec();
        const content = await this.contentsService.details(campaign.contentId);
        const numberOfEmails = (0, lodash_1.get)(content, ['emails', 'length'], 0);
        return Object.assign(Object.assign({}, campaign.castTo(campaign_1.Campaign)), { numberOfEmails,
            content });
    }
    async deleteCampaign(id) {
        return this.campaignRepository.delete(id);
    }
    async getCustomerCampaignsByContent(customer, contentsId) {
        const query = {
            customer: customer._id,
            contentId: { $in: contentsId },
        };
        return this.campaignRepository.findAll(query);
    }
    async findByMessageId(messageId) {
        const filter = {
            messageIds: { $in: messageId },
        };
        return this.campaignModel.findOne(filter).exec();
    }
    async cancelCampaignsByTemplateId(templateId) {
        const campaigns = await this.campaignModel
            .find({ templateIds: { $eq: templateId } })
            .exec();
        const promises = (0, lodash_1.map)(campaigns, (campaign) => {
            return this.campaignModel.findByIdAndUpdate((0, lodash_1.get)(campaign, '_id'), {
                status: types_1.CampaignStatus.CANCELED,
            }, { new: true });
        });
        await Promise.all(promises);
    }
    async canBeChanged(campaignId) {
        try {
            const campaign = await this.campaignModel.findById(campaignId);
            return campaign.status !== types_1.CampaignStatus.CANCELED;
        }
        catch (exception) {
            return false;
        }
    }
    async getCampaignHistory(campaign) {
        return this.campaignHistoryModel
            .find({ campaign })
            .populate('campaign')
            .exec();
    }
    async getCampaignHistorySerialized(campaign) {
        const history = await this.getCampaignHistory(campaign);
        return history.map((item) => this.serializeHistory(item));
    }
    serializeHistory(campaignHistory) {
        const { name: campaignName } = campaignHistory.campaign;
        const { templateNames, type, messageIds } = campaignHistory;
        return {
            id: campaignHistory._id,
            campaignName,
            templateNames,
            messageIds,
            type,
            createdAt: (0, lodash_1.get)(campaignHistory, 'createdAt'),
        };
    }
    async getById(id) {
        return this.campaignModel.findById(id).populate(['customer']).exec();
    }
    async getAllHistoryCampaigns(customer, page = 0, perPage = 15) {
        const customerId = customer._id;
        const campaigns = await this.campaignModel
            .find({ customer: customerId })
            .exec();
        const query = {
            campaign: {
                $in: campaigns.map((campaign) => campaign._id),
            },
        };
        const total = await this.campaignHistoryModel.countDocuments(query).exec();
        const skip = page * perPage;
        const history = await this.campaignHistoryModel
            .find(query)
            .populate(['campaign'])
            .limit(perPage)
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .exec();
        return paginator_1.PaginatorSchema.build(total, history, page, perPage);
    }
    async getEmailCampaignMetrics(page = 0, perPage = 15, startDate, endDate) {
        const campaignsFilters = {
            status: types_1.CampaignStatus.ACTIVE,
        };
        return this.getCampaignMetrics(campaignsFilters, startDate, endDate, page, perPage);
    }
    async findCampaignHistoryByMessageId(messageId) {
        const filter = {
            messageIds: { $in: messageId },
        };
        return this.campaignHistoryModel.findOne(filter).exec();
    }
    async getEmailCampaignMetricsForMember(customer, page = 0, perPage = 15, startDate, endDate) {
        const campaignsFilters = {
            customer: customer._id,
            status: types_1.CampaignStatus.ACTIVE,
        };
        return this.getCampaignMetrics(campaignsFilters, startDate, endDate, page, perPage);
    }
    async getMetrics(options, campaigns) {
        const start = options.start
            ? luxon_1.DateTime.fromJSDate(options.start)
            : luxon_1.DateTime.local().minus({ day: 30 });
        const end = options.end
            ? luxon_1.DateTime.fromJSDate(options.end)
            : luxon_1.DateTime.local();
        const { perPage, page } = options;
        const dateDiff = start.diff(end, 'days').toObject();
        const previousStart = start
            .minus({ day: Math.abs(dateDiff.days) })
            .toISODate();
        const previousEnd = start.minus({ day: 1 }).toISODate();
        const [campaignMetricsCurrent, campaignMetricsPrevious] = await Promise.all([
            this.getEmailData(campaigns, start.toISODate(), end.toISODate()),
            this.getEmailData(campaigns, previousStart, previousEnd),
        ]);
        const totalCurrent = campaignMetricsCurrent.reduce((acc, cur) => {
            Object.entries(cur.metricsMeta).forEach(([key, value]) => {
                acc[key] = (acc[key] || 0) + value;
            });
            return acc;
        }, {
            Send: 0,
            Open: 0,
            Click: 0,
            Bounce: 0,
            Complaint: 0,
            Delivery: 0,
        });
        const totalPrevious = campaignMetricsPrevious.reduce((acc, cur) => {
            Object.entries(cur.metricsMeta).forEach(([key, value]) => {
                acc[key] = (acc[key] || 0) + value;
            });
            return acc;
        }, {
            Send: 0,
            Open: 0,
            Click: 0,
            Bounce: 0,
            Complaint: 0,
            Delivery: 0,
        });
        return {
            data: campaignMetricsCurrent,
            total: {
                current: totalCurrent,
                previous: totalPrevious,
            },
            meta: {
                page,
                perPage,
                total: campaigns.length,
            },
        };
    }
    async emailMetrics(customer, options) {
        const { perPage, page } = options;
        const query = {
            status: types_1.CampaignStatus.ACTIVE,
            customer: customer._id,
        };
        if (options.textSearch) {
            query['$or'] = [
                { name: { $regex: new RegExp(options.textSearch), $options: 'i' } },
            ];
        }
        const campaigns = await this.campaignRepository.findAll(query, {
            skip: page * perPage,
            limit: perPage,
            sort: options.sortBy,
            collation: {
                locale: 'en',
                caseLevel: false,
            },
        });
        return this.getMetrics(options, campaigns);
    }
    async enqueueEmailMetricsJob(customer, options) {
        const campaignIds = options.campaignIds;
        const bucket = options.bucket;
        const formattedData = [];
        for (const campaignId of campaignIds) {
            const campaign = await this.campaignRepository.findById(campaignId);
            const metrics = await this.getMetrics(options, [campaign]);
            const data = (0, email_metrics_1.formatMetrics)(metrics);
            formattedData.push({
                campaignId,
                data,
            });
        }
        const jobData = {
            formattedData,
            customer,
            email: options.email,
            bucket,
        };
        const opts = { removeOnComplete: true };
        await this.csvUploaderQueue.add(jobData, opts);
        return true;
    }
    async getEmailData(campaigns, start, end) {
        return Promise.all(campaigns.map(async (campaign) => {
            const { _id: campaignId, messageIds, name, segments, allSegments, status, startDate, allowWeekend, contentId, createdAt, updatedAt, } = campaign;
            if (!messageIds) {
                return {};
            }
            const [metrics, segmentDetails] = await Promise.all([
                this.notificationsService.getEmailMetrics(messageIds.filter((id) => id), start, end),
                this.segmentsService.listById({
                    filters: { ids: segments },
                }),
            ]);
            return {
                metrics: metrics.data,
                metricsMeta: metrics.meta,
                campaign: {
                    id: campaignId,
                    name,
                    segments: segmentDetails,
                    allSegments,
                    status,
                    startDate,
                    allowWeekend,
                    contentId,
                    createdAt,
                    updatedAt,
                },
            };
        }));
    }
    async getCampaignMetrics(campaignsFilters, startDate, endDate, page, perPage) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const campaigns = await this.campaignModel.find(campaignsFilters, {
            _id: 1,
            name: 1,
            segments: 1,
            allSegments: 1,
            status: 1,
            customer: 1,
        }, {
            populate: { path: 'customer', select: ['firstName', 'lastName'] },
        });
        const segments = campaigns
            .map((campaign) => campaign.segments)
            .flat();
        const campaignsWithSegments = await this.segmentsService.attachSegments(campaigns, segments);
        const query = {
            campaign: {
                $in: campaigns.map((campaign) => campaign._id),
            },
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        };
        const total = await this.campaignHistoryModel.countDocuments(query).exec();
        const skip = page * perPage;
        const history = await this.campaignHistoryModel
            .find(query, {
            _id: 1,
            campaign: 1,
            messageIds: 1,
            templateNames: 1,
            createdAt: 1,
            updatedAt: 1,
        })
            .limit(perPage)
            .sort({ updatedAt: 'desc', createdAt: 'desc' })
            .skip(skip)
            .exec();
        let historyPopulated = [];
        const messageIds = [];
        const campaignsMap = new Map();
        campaignsWithSegments.forEach((campaign) => campaignsMap.set(campaign._id.toString(), campaign));
        for (const hist of history) {
            const campaign = campaignsMap.get(hist.campaign.toString());
            messageIds.push(...hist.messageIds.filter((item) => item));
            historyPopulated.push(Object.assign(Object.assign({}, hist.toObject()), { name: campaign.name, segments: campaign.allSegments
                    ? [{ id: null, name: 'All Segments' }]
                    : campaign.segments, status: campaign.status, customer: (campaign.customer), totalSent: 0, totalDelivery: 0, totalBounce: 0, totalComplaints: 0 }));
        }
        const uniqueMessageIds = Array.from(new Set(messageIds));
        const elasticResults = await this.analyticsService.getEmailHistoryByMessageIds(uniqueMessageIds);
        const hits = (_a = elasticResults === null || elasticResults === void 0 ? void 0 : elasticResults.hits) === null || _a === void 0 ? void 0 : _a.hits;
        const buckets = ((_c = (_b = elasticResults === null || elasticResults === void 0 ? void 0 : elasticResults.aggregations) === null || _b === void 0 ? void 0 : _b.eventTypes) === null || _c === void 0 ? void 0 : _c.buckets);
        historyPopulated = historyPopulated.map((hist) => {
            const emailHistory = hits === null || hits === void 0 ? void 0 : hits.filter((hit) => {
                var _a, _b, _c;
                return (hist.messageIds.indexOf((_c = (_b = (_a = hit === null || hit === void 0 ? void 0 : hit._source) === null || _a === void 0 ? void 0 : _a.rawData) === null || _b === void 0 ? void 0 : _b.mail) === null || _c === void 0 ? void 0 : _c.messageId) > -1);
            });
            emailHistory === null || emailHistory === void 0 ? void 0 : emailHistory.forEach((hit) => {
                var _a, _b;
                switch ((_b = (_a = hit === null || hit === void 0 ? void 0 : hit._source) === null || _a === void 0 ? void 0 : _a.rawData) === null || _b === void 0 ? void 0 : _b.eventType) {
                    case 'Send':
                        hist.totalSent++;
                        break;
                    case 'Delivery':
                        hist.totalDelivery++;
                        break;
                    case 'Bounce':
                        hist.totalBounce++;
                        break;
                    case 'Complaint':
                        hist.totalComplaints++;
                        break;
                }
            });
            return hist;
        });
        const totals = {
            delivery: Number((_e = (_d = buckets === null || buckets === void 0 ? void 0 : buckets.find((bucket) => bucket.key === 'Delivery')) === null || _d === void 0 ? void 0 : _d.doc_count) !== null && _e !== void 0 ? _e : 0),
            bounce: Number((_g = (_f = buckets === null || buckets === void 0 ? void 0 : buckets.find((bucket) => bucket.key === 'Bounce')) === null || _f === void 0 ? void 0 : _f.doc_count) !== null && _g !== void 0 ? _g : 0),
            unsubscribed: Number((_j = (_h = buckets === null || buckets === void 0 ? void 0 : buckets.find((bucket) => bucket.key === 'Complaints')) === null || _h === void 0 ? void 0 : _h.doc_count) !== null && _j !== void 0 ? _j : 0),
            total: Number((_l = (_k = buckets === null || buckets === void 0 ? void 0 : buckets.find((bucket) => bucket.key === 'Send')) === null || _k === void 0 ? void 0 : _k.doc_count) !== null && _l !== void 0 ? _l : 0),
        };
        const historyPaginated = paginator_1.PaginatorSchema.build(total, historyPopulated, page, perPage);
        return {
            campaigns: campaigns.length,
            history: historyPaginated,
            totals,
        };
    }
};
CampaignsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(campaign_schema_1.Campaign.name)),
    __param(1, (0, mongoose_1.InjectModel)(campaign_history_schema_1.CampaignHistory.name)),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => templates_service_1.TemplatesService))),
    __param(9, (0, bull_1.InjectQueue)(constants_1.CSV_UPLOADER_QUEUE)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        contents_service_1.ContentsService,
        segments_service_1.SegmentsService,
        campaign_repository_1.CampaignRepository,
        email_history_service_1.EmailHistoryService,
        templates_service_1.TemplatesService,
        analytics_service_1.AnalyticsService,
        afy_notifications_service_1.AfyNotificationsService, Object])
], CampaignsService);
exports.CampaignsService = CampaignsService;
//# sourceMappingURL=campaigns.service.js.map
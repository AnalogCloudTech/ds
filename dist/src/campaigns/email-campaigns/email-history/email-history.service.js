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
exports.EmailHistoryService = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../campaigns/services");
const leads_service_1 = require("../leads/leads.service");
const on_demand_emails_service_1 = require("../on-demand-emails/on-demand-emails.service");
const types_1 = require("./schemas/types");
const lodash_1 = require("lodash");
const email_history_repository_1 = require("./email-history.repository");
const extract_data_1 = require("./utils/extract-data");
let EmailHistoryService = class EmailHistoryService {
    constructor(emailHistoryRepository, campaignsService, onDemandEmailsService, leadsService) {
        this.emailHistoryRepository = emailHistoryRepository;
        this.campaignsService = campaignsService;
        this.onDemandEmailsService = onDemandEmailsService;
        this.leadsService = leadsService;
    }
    async listEmailHistory(user, page, perPage, status, type) {
        const leads = await this.leadsService.findAll(user);
        const query = {
            lead: { $in: leads.map(({ _id }) => _id) || [] },
        };
        if (status) {
            query['status'] = { $in: status };
        }
        if (type) {
            query['relationType'] = { $in: type };
        }
        const options = {
            sort: { createdAt: 'desc' },
            skip: page * perPage,
            limit: perPage,
            populate: ['relationId', 'lead'],
        };
        return this.emailHistoryRepository.findAllPaginated(query, options);
    }
    async getEmailHistory(user, id) {
        const leads = await this.leadsService.findAll(user);
        const query = {
            _id: { $eq: id },
            lead: { $in: leads.map(({ _id }) => _id) || [] },
        };
        const options = {
            populate: ['relationId', 'lead'],
        };
        const emailHistory = await this.emailHistoryRepository.findAll(query, options);
        if (!emailHistory)
            throw new common_1.HttpException('Email History not found', common_1.HttpStatus.NOT_FOUND);
        return emailHistory;
    }
    async getEmailHistoryByLead(user, leadId, page, perPage, status, type) {
        const leads = await this.leadsService.findAll(user);
        const query = {
            lead: {
                $in: leads.filter(({ _id }) => _id.toString() === leadId) || [],
            },
        };
        if (status) {
            query['status'] = { $in: status };
        }
        if (type) {
            query['relationType'] = { $in: type };
        }
        const options = {
            sort: { createdAt: 'desc' },
            skip: page * perPage,
            limit: perPage,
            populate: ['relationId', 'lead'],
        };
        return this.emailHistoryRepository.findAllPaginated(query, options);
    }
    async createFromSNS(snsMessage) {
        var _a;
        const emails = (0, extract_data_1.default)(snsMessage);
        const { messageId, timestamp } = snsMessage.mail;
        const eventType = snsMessage.eventType.toUpperCase();
        const isBounce = eventType.toLocaleLowerCase() === types_1.LeadHistoryStatus.BOUNCE;
        const isHardBounce = isBounce && ((_a = snsMessage === null || snsMessage === void 0 ? void 0 : snsMessage.bounce) === null || _a === void 0 ? void 0 : _a.bounceType) === 'Permanent';
        const isSoftBounce = isBounce && !isHardBounce;
        const diagnosticCodes = (0, extract_data_1.extractDiagnosticCode)(snsMessage);
        return await Promise.all(emails.map(async (email) => {
            const findCampaignHistory = await this.campaignsService.findCampaignHistoryByMessageId(messageId);
            const findOnDemandEmail = await this.onDemandEmailsService.findByMessageId(messageId);
            if (findCampaignHistory || findOnDemandEmail) {
                const isValid = !isHardBounce ||
                    ![
                        types_1.LeadHistoryStatus.COMPLAINT,
                        types_1.LeadHistoryStatus.UNSUBSCRIBED,
                        types_1.LeadHistoryStatus.REJECTED,
                    ].includes(eventType.toLocaleLowerCase());
                const updatedLeads = await this.leadsService.updateMany({
                    email: { $eq: email },
                }, {
                    isValid,
                });
                const [lead] = updatedLeads;
                const status = isSoftBounce
                    ? types_1.LeadHistoryStatus.SOFT_BOUNCE
                    : types_1.LeadHistoryStatus[`${eventType}`] ||
                        types_1.LeadHistoryStatus.DEFAULT;
                const emailHistoryData = {
                    lead,
                    sentDate: timestamp,
                    relationId: findCampaignHistory || findOnDemandEmail,
                    relationType: findCampaignHistory
                        ? types_1.RelationTypes.CAMPAIGNS_HISTORY
                        : types_1.RelationTypes.ON_DEMAND_EMAILS,
                    status,
                    extraInfos: diagnosticCodes,
                    rawData: snsMessage,
                };
                return this.emailHistoryRepository.store(emailHistoryData);
            }
        }));
    }
    async addHistoryFromOnDemandEmail(dto) {
        return this.emailHistoryRepository.store(dto);
    }
    async getEmailHistoryCount(campaignsIds) {
        const emailCount = [];
        const emailBounceCount = [];
        const campaignsHistory = await this.emailHistoryRepository.findAll({
            relationId: { $in: campaignsIds },
            relationType: types_1.RelationTypes.CAMPAIGNS,
        });
        (0, lodash_1.forEach)(campaignsHistory, (emailHistory) => {
            if (emailHistory.status === types_1.LeadHistoryStatus.SEND) {
                emailCount.push(emailHistory);
            }
            if (emailHistory.status === types_1.LeadHistoryStatus.BOUNCE) {
                emailBounceCount.push(emailHistory);
            }
        });
        return [emailCount.length, emailBounceCount.length];
    }
    async getEmailHistoryCountBycampaignHisId(campaignsHistoryids) {
        const [emailCount, emailBounceCount] = await Promise.all([
            this.emailHistoryRepository.findAll({
                relationId: { $in: campaignsHistoryids },
                relationType: types_1.RelationTypes.CAMPAIGNS_HISTORY,
                $or: [
                    { status: types_1.LeadHistoryStatus.DELIVERY },
                    { status: types_1.LeadHistoryStatus.BOUNCE },
                ],
            }),
            this.emailHistoryRepository.findAll({
                relationId: { $in: campaignsHistoryids },
                status: types_1.LeadHistoryStatus.BOUNCE,
                relationType: types_1.RelationTypes.CAMPAIGNS_HISTORY,
            }),
        ]);
        return [emailCount.length, emailBounceCount.length];
    }
    async getEmailHistoryCountBycampaignHistoryId(campaignsIds, email) {
        const emailCount = [];
        const emailBounceCount = [];
        const unSubscribedLeadCount = [];
        const leads = await this.leadsService.findAllLeadsByMemberEmailId(email);
        const query = {
            relationId: { $eq: campaignsIds },
            lead: { $in: leads.map(({ _id }) => _id) || [] },
        };
        const options = {
            populate: ['relationId', 'lead'],
        };
        const campaignsHistory = await this.emailHistoryRepository.findAll(query, options);
        (0, lodash_1.forEach)(campaignsHistory, (emailHistory) => {
            const unsubsc = (0, lodash_1.get)(emailHistory, ['lead', 'unsubscribed']);
            if (unsubsc) {
                unSubscribedLeadCount.push(emailHistory);
            }
            if (emailHistory.status === types_1.LeadHistoryStatus.DELIVERY) {
                emailCount.push(emailHistory);
            }
            if (emailHistory.status === types_1.LeadHistoryStatus.BOUNCE) {
                emailBounceCount.push(emailHistory);
            }
        });
        return [
            emailCount.length,
            emailBounceCount.length,
            unSubscribedLeadCount.length,
        ];
    }
    async countEmailHistory(filter) {
        return this.emailHistoryRepository.count(filter);
    }
};
EmailHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => services_1.CampaignsService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => on_demand_emails_service_1.OnDemandEmailsService))),
    __metadata("design:paramtypes", [email_history_repository_1.EmailHistoryRepository,
        services_1.CampaignsService,
        on_demand_emails_service_1.OnDemandEmailsService,
        leads_service_1.LeadsService])
], EmailHistoryService);
exports.EmailHistoryService = EmailHistoryService;
//# sourceMappingURL=email-history.service.js.map
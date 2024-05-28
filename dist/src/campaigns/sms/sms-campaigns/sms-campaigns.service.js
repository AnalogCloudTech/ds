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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsCampaignsService = void 0;
const common_1 = require("@nestjs/common");
const sms_campaign_repository_1 = require("./repositories/sms-campaign.repository");
const leads_service_1 = require("../../email-campaigns/leads/leads.service");
const types_1 = require("./domain/types");
const luxon_1 = require("luxon");
let SmsCampaignsService = class SmsCampaignsService {
    constructor(repository, leadsService) {
        this.repository = repository;
        this.leadsService = leadsService;
    }
    store(customer, createSmsCampaignDto) {
        const data = Object.assign({ customer: customer._id }, createSmsCampaignDto);
        return this.repository.store(data);
    }
    findAllPaginated(customer, paginator, query = {}) {
        query['customer'] = {
            $eq: customer._id,
        };
        const options = {
            skip: paginator.page * paginator.perPage,
            sort: { createdAt: 'desc' },
        };
        return this.repository.findAllPaginated(query, options);
    }
    async findOne(id) {
        return this.repository.findById(id);
    }
    async update(id, updateSmsCampaignDto) {
        return this.repository.update(id, updateSmsCampaignDto);
    }
    async remove(id) {
        return this.repository.delete(id);
    }
    async campaignsToBeSent() {
        const query = {
            status: { $eq: types_1.Statuses.STATUS_SCHEDULED },
            scheduleDate: { $lte: luxon_1.DateTime.now() },
        };
        const options = {
            populate: ['customer'],
            sort: { createdAt: 'asc' },
        };
        return this.repository.findAll(query, options);
    }
    async getLeads(smsCampaign, customer) {
        const filters = {
            $and: [
                { unsubscribed: { $eq: false } },
                {
                    $or: [
                        { customerEmail: { $eq: customer.email } },
                        { customer: { $eq: customer._id } },
                    ],
                },
            ],
        };
        if (!smsCampaign.allSegments) {
            filters.$and.push({
                $or: [
                    { segments: { $in: smsCampaign.segments } },
                    { allSegments: true },
                ],
            });
        }
        return this.leadsService.getAllFromFilter(filters);
    }
    async setDone(smsCampaign) {
        return this.repository.update(smsCampaign._id, {
            status: types_1.Statuses.STATUS_DONE,
        });
    }
};
SmsCampaignsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sms_campaign_repository_1.SmsCampaignRepository,
        leads_service_1.LeadsService])
], SmsCampaignsService);
exports.SmsCampaignsService = SmsCampaignsService;
//# sourceMappingURL=sms-campaigns.service.js.map
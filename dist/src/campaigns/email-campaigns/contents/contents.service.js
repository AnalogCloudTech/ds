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
exports.ContentsService = void 0;
const common_1 = require("@nestjs/common");
const cms_service_1 = require("../../../cms/cms/cms.service");
const cms_populate_builder_1 = require("../../../internal/utils/cms/populate/cms.populate.builder");
const lodash_1 = require("lodash");
const campaigns_service_1 = require("../campaigns/services/campaigns.service");
const luxon_1 = require("luxon");
let ContentsService = class ContentsService {
    constructor(cmsService, campaignsService) {
        this.cmsService = cmsService;
        this.campaignsService = campaignsService;
    }
    async findAll() {
        const query = {
            populate: ['emails', 'image'],
        };
        const queryString = cms_populate_builder_1.CmsPopulateBuilder.build(query);
        return this.cmsService.contentsList(`?${queryString}`);
    }
    async findAllWithCustomerCampaignId(customer) {
        const query = {
            populate: ['emails', 'image'],
        };
        const queryString = cms_populate_builder_1.CmsPopulateBuilder.build(query);
        const contents = await this.cmsService.contentsList(`?${queryString}`);
        const contentsId = (0, lodash_1.map)(contents, (content) => content.id);
        const campaigns = await this.campaignsService.getCustomerCampaignsByContent(customer, contentsId);
        return (0, lodash_1.map)(contents, (content) => {
            const campaign = (0, lodash_1.find)(campaigns, (campaign) => campaign.contentId === content.id);
            return Object.assign(Object.assign({}, content), { campaignId: (0, lodash_1.get)(campaign, '_id', null) });
        });
    }
    async details(id) {
        const details = await this.cmsService.contentDetails(id);
        const { emails } = details;
        const now = luxon_1.DateTime.now().startOf('day');
        let index = 0;
        let diff = luxon_1.DateTime.now().endOf('year').diff(luxon_1.DateTime.now().startOf('year'), 'hours').toObject().hours;
        emails.forEach((email, idx) => {
            const { absoluteMonth: month, absoluteDay: day } = email;
            const emailDate = luxon_1.DateTime.now().set({ month, day }).startOf('day');
            const diffDate = emailDate.diff(now, 'hours').toObject();
            const absDiff = Math.abs(diffDate.hours);
            if (diff > absDiff) {
                diff = absDiff;
                index = idx;
            }
        });
        const toMove = [];
        const toMoveIds = [];
        let foundId = false;
        emails.forEach((email, idx) => {
            if (!foundId) {
                if (idx === index) {
                    foundId = true;
                }
                else {
                    toMoveIds.push(email.id);
                    toMove.push(email);
                }
            }
        });
        const filteredList = emails.filter((email) => !toMoveIds.includes(email.id));
        return Object.assign(Object.assign({}, details), { emails: [...filteredList, ...toMove] });
    }
    async detailsRaw(id) {
        return this.cmsService.contentDetailsRaw(id);
    }
};
ContentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => campaigns_service_1.CampaignsService))),
    __metadata("design:paramtypes", [cms_service_1.CmsService,
        campaigns_service_1.CampaignsService])
], ContentsService);
exports.ContentsService = ContentsService;
//# sourceMappingURL=contents.service.js.map
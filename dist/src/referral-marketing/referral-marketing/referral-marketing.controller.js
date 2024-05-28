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
exports.ReferralMarketingController = void 0;
const common_1 = require("@nestjs/common");
const referral_marketing_service_1 = require("./referral-marketing.service");
const create_referral_marketing_dto_1 = require("./dto/create-referral-marketing.dto");
const update_referral_marketing_dto_1 = require("./dto/update-referral-marketing.dto");
const paginator_1 = require("../../internal/utils/paginator");
const referral_marketing_domain_1 = require("./domain/referral-marketing-domain");
const validation_transform_pipe_1 = require("../../internal/common/pipes/validation-transform.pipe");
let ReferralMarketingController = class ReferralMarketingController {
    constructor(referralMarketingService) {
        this.referralMarketingService = referralMarketingService;
    }
    async create(createReferralMarketingDto) {
        const referralMarketingCreated = await this.referralMarketingService.create(createReferralMarketingDto);
        return Object.assign(Object.assign({}, referralMarketingCreated.castTo(referral_marketing_domain_1.ReferralMarketingDomain)), { memberDetails: referralMarketingCreated.memberDetails, frontCover: referralMarketingCreated.frontCover, insideCover: referralMarketingCreated.insideCover, backInsideCoverTemplate: referralMarketingCreated.backInsideCoverTemplate, additionalCustomization: referralMarketingCreated.additionalCustomization, listingDetails: referralMarketingCreated.listingDetails });
    }
    async findAll(status, sorting, { page, perPage }) {
        const marketingDetails = await this.referralMarketingService.findAll(page, perPage, status, sorting);
        return marketingDetails;
    }
    async findOne(id) {
        const marketingDetails = await this.referralMarketingService.findOne(id);
        return Object.assign(Object.assign({}, marketingDetails.castTo(referral_marketing_domain_1.ReferralMarketingDomain)), { memberDetails: marketingDetails.memberDetails, frontCover: marketingDetails.frontCover, insideCover: marketingDetails.insideCover, backInsideCoverTemplate: marketingDetails.backInsideCoverTemplate, additionalCustomization: marketingDetails.additionalCustomization, listingDetails: marketingDetails.listingDetails });
    }
    async update(id, updateReferralMarketingDto) {
        const updated = await this.referralMarketingService.update(id, updateReferralMarketingDto);
        return updated.castTo(referral_marketing_domain_1.ReferralMarketingDomain);
    }
    async remove(id) {
        const result = await this.referralMarketingService.remove(id);
        return result.castTo(referral_marketing_domain_1.ReferralMarketingDomain);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_referral_marketing_dto_1.CreateReferralMarketingDto]),
    __metadata("design:returntype", Promise)
], ReferralMarketingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('sorting')),
    __param(2, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, paginator_1.Paginator]),
    __metadata("design:returntype", Promise)
], ReferralMarketingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReferralMarketingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_referral_marketing_dto_1.UpdateReferralMarketingDto]),
    __metadata("design:returntype", Promise)
], ReferralMarketingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReferralMarketingController.prototype, "remove", null);
ReferralMarketingController = __decorate([
    (0, common_1.Controller)({ path: 'referral-marketing', version: '1' }),
    __metadata("design:paramtypes", [referral_marketing_service_1.ReferralMarketingService])
], ReferralMarketingController);
exports.ReferralMarketingController = ReferralMarketingController;
//# sourceMappingURL=referral-marketing.controller.js.map
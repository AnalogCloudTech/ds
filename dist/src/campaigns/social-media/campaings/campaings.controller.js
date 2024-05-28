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
exports.CampaingsController = void 0;
const paginator_1 = require("../../../internal/utils/paginator");
const common_1 = require("@nestjs/common");
const customer_by_identities_pipe_1 = require("../../../customers/customers/pipes/transform/customer-by-identities.pipe");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const campaings_service_1 = require("./campaings.service");
const campaigns_domain_1 = require("./domain/campaigns.domain");
const create_campaign_dto_1 = require("./dto/create-campaign.dto");
const update_campaign_dto_1 = require("./dto/update-campaign.dto");
const validation_transform_pipe_1 = require("../../../internal/common/pipes/validation-transform.pipe");
let CampaingsController = class CampaingsController {
    constructor(campaingsService) {
        this.campaingsService = campaingsService;
    }
    create(customer, createCampaingDto) {
        return this.campaingsService.create(customer, createCampaingDto);
    }
    findAllByCustomerId(customer, { page, perPage }) {
        return this.campaingsService.findAllByCustomerId(customer, page, perPage);
    }
    findOne(id) {
        return this.campaingsService.findOne(id);
    }
    update(id, updateCampaingDto) {
        return this.campaingsService.update(id, updateCampaingDto);
    }
    remove(id) {
        return this.campaingsService.remove(id);
    }
};
__decorate([
    (0, serialize_interceptor_1.Serialize)(campaigns_domain_1.CampaignDomain),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_campaign_dto_1.CreateCampaignDto]),
    __metadata("design:returntype", void 0)
], CampaingsController.prototype, "create", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(campaigns_domain_1.CampaignDomain),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, paginator_1.Paginator]),
    __metadata("design:returntype", Promise)
], CampaingsController.prototype, "findAllByCustomerId", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(campaigns_domain_1.CampaignDomain),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaingsController.prototype, "findOne", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(campaigns_domain_1.CampaignDomain),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_campaign_dto_1.UpdateCampaignDto]),
    __metadata("design:returntype", void 0)
], CampaingsController.prototype, "update", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(campaigns_domain_1.CampaignDomain),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaingsController.prototype, "remove", null);
CampaingsController = __decorate([
    (0, common_1.Controller)({ path: 'social-media/campaings', version: '1' }),
    __metadata("design:paramtypes", [campaings_service_1.CampaingsService])
], CampaingsController);
exports.CampaingsController = CampaingsController;
//# sourceMappingURL=campaings.controller.js.map
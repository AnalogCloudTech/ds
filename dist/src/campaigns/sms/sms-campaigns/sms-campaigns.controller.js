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
exports.SmsCampaignsController = void 0;
const common_1 = require("@nestjs/common");
const sms_campaigns_service_1 = require("./sms-campaigns.service");
const create_sms_campaign_dto_1 = require("./dto/create-sms-campaign.dto");
const update_sms_campaign_dto_1 = require("./dto/update-sms-campaign.dto");
const customer_by_identities_pipe_1 = require("../../../customers/customers/pipes/transform/customer-by-identities.pipe");
const paginator_1 = require("../../../internal/utils/paginator");
const validation_transform_pipe_1 = require("../../../internal/common/pipes/validation-transform.pipe");
let SmsCampaignsController = class SmsCampaignsController {
    constructor(smsCampaignsService) {
        this.smsCampaignsService = smsCampaignsService;
    }
    create(customer, createSmsCampaignDto) {
        return this.smsCampaignsService.store(customer, createSmsCampaignDto);
    }
    findAll(customer, paginator, query = {}) {
        return this.smsCampaignsService.findAllPaginated(customer, paginator, query);
    }
    findOne(id) {
        return this.smsCampaignsService.findOne(id);
    }
    update(id, updateSmsCampaignDto) {
        return this.smsCampaignsService.update(id, updateSmsCampaignDto);
    }
    remove(id) {
        return this.smsCampaignsService.remove(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_sms_campaign_dto_1.CreateSmsCampaignDto]),
    __metadata("design:returntype", void 0)
], SmsCampaignsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, paginator_1.Paginator, Object]),
    __metadata("design:returntype", void 0)
], SmsCampaignsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SmsCampaignsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_sms_campaign_dto_1.UpdateSmsCampaignDto]),
    __metadata("design:returntype", void 0)
], SmsCampaignsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SmsCampaignsController.prototype, "remove", null);
SmsCampaignsController = __decorate([
    (0, common_1.Controller)({
        version: '1',
        path: 'sms-campaigns',
    }),
    __metadata("design:paramtypes", [sms_campaigns_service_1.SmsCampaignsService])
], SmsCampaignsController);
exports.SmsCampaignsController = SmsCampaignsController;
//# sourceMappingURL=sms-campaigns.controller.js.map
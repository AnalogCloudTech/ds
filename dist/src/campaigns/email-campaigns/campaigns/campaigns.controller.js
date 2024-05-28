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
exports.CampaignsController = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("./services");
const campaign_dto_1 = require("./dto/campaign.dto");
const customer_email_transform_pipe_1 = require("../common/pipes/customer-email-transform.pipe");
const paginator_1 = require("../../../internal/utils/paginator");
const validate_segments_pipe_1 = require("../common/pipes/validate-segments.pipe");
const campaign_1 = require("./domain/campaign");
const customer_by_identities_pipe_1 = require("../../../customers/customers/pipes/transform/customer-by-identities.pipe");
const can_be_changed_pipe_1 = require("./pipes/can-be-changed.pipe");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const types_1 = require("./domain/types");
const date_range_dto_1 = require("../../../internal/common/dtos/date-range.dto");
const validation_transform_pipe_1 = require("../../../internal/common/pipes/validation-transform.pipe");
const campaign_metrics_query_params_dto_1 = require("./dto/campaign-metrics-query-params.dto");
const campaign_metrics_export_params_dto_1 = require("./dto/campaign-metrics-export-params.dto");
let CampaignsController = class CampaignsController {
    constructor(service, sendCampaignsService) {
        this.service = service;
        this.sendCampaignsService = sendCampaignsService;
    }
    async getCampaigns({ page, perPage }, customer) {
        return this.service.getCampaigns(customer, page, perPage);
    }
    async getAllHistoryCampaigns({ page, perPage }, customer) {
        return this.service.getAllHistoryCampaigns(customer, page, perPage);
    }
    async getCampaign(customer, id) {
        return this.service.getCampaign(customer, id);
    }
    async createCampaign(customer, dto) {
        return this.service.createCampaign(customer, dto);
    }
    async updateStatus(dto, id) {
        return this.service.updateCampaignStatus(id, dto);
    }
    updateCampaign(body, id) {
        return this.service.updateCampaign(id, body);
    }
    deleteCampaign(id) {
        return this.service.deleteCampaign(id);
    }
    async getHistory(id) {
        return this.service.getCampaignHistorySerialized(id);
    }
    async forceSendCampaign(id) {
        const campaigns = [await this.service.getById(id)];
        console.time('handleCampaigns');
        console.time('sendAbsoluteCampaigns');
        await this.sendCampaignsService.sendAllCampaignsByHandler(campaigns, types_1.CampaignHandler.ABSOLUTE);
        console.timeEnd('sendAbsoluteCampaigns');
        console.time('sendRelativeCampaigns');
        await this.sendCampaignsService.sendAllCampaignsByHandler(campaigns, types_1.CampaignHandler.RELATIVE);
        console.timeEnd('sendRelativeCampaigns');
        console.timeEnd('handleCampaigns');
    }
    async getEmailCampaignMetrics({ page, perPage }, { startDate, endDate }) {
        return this.service.getEmailCampaignMetrics(page, perPage, startDate, endDate);
    }
    getMemberEmailCampaignMetrics({ page, perPage }, { startDate, endDate }, customer) {
        return this.service.getEmailCampaignMetricsForMember(customer, page, perPage, startDate, endDate);
    }
    getMetrics({ page, perPage }, options, customer) {
        return this.service.emailMetrics(customer, Object.assign(Object.assign({}, options), { perPage,
            page }));
    }
    enqueueEmailMetricsJob(options, customer) {
        return this.service.enqueueEmailMetricsJob(customer, options);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator, Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "getCampaigns", null);
__decorate([
    (0, common_1.Get)('campaigns-history'),
    __param(0, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator, Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "getAllHistoryCampaigns", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "getCampaign", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(campaign_1.Campaign),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe, customer_email_transform_pipe_1.CustomerEmailTransformPipe, validate_segments_pipe_1.ValidateSegmentsPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, campaign_dto_1.CreateCampaignDto]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "createCampaign", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(campaign_1.Campaign),
    (0, common_1.Post)(':id/status'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Param)('id', can_be_changed_pipe_1.CanBeChangedPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [campaign_dto_1.UpdateCampaignStatusDto, Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Param)('id', can_be_changed_pipe_1.CanBeChangedPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [campaign_dto_1.CreateCampaignDto, Object]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "updateCampaign", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "deleteCampaign", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Post)(':id/force-send-active-campaigns'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "forceSendCampaign", null);
__decorate([
    (0, common_1.Get)('metrics/reports'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Query)(paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator,
        date_range_dto_1.default]),
    __metadata("design:returntype", Promise)
], CampaignsController.prototype, "getEmailCampaignMetrics", null);
__decorate([
    (0, common_1.Get)('email-metrics/reports'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Query)(paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator,
        date_range_dto_1.default, Object]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "getMemberEmailCampaignMetrics", null);
__decorate([
    (0, common_1.Get)('email/metrics'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Query)(paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator,
        campaign_metrics_query_params_dto_1.CampaignMetricsQueryParams, Object]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Post)('email/metrics-export'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [campaign_metrics_export_params_dto_1.CampaignMetricsExportParams, Object]),
    __metadata("design:returntype", void 0)
], CampaignsController.prototype, "enqueueEmailMetricsJob", null);
CampaignsController = __decorate([
    (0, common_1.Controller)({ path: 'email-campaigns/campaigns', version: '1' }),
    __metadata("design:paramtypes", [services_1.CampaignsService,
        services_1.SendCampaignsService])
], CampaignsController);
exports.CampaignsController = CampaignsController;
//# sourceMappingURL=campaigns.controller.js.map
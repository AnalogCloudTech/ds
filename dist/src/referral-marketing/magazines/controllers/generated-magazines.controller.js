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
exports.GeneratedMagazinesController = void 0;
const common_1 = require("@nestjs/common");
const paginator_1 = require("../../../internal/utils/paginator");
const generated_magazines_service_1 = require("../services/generated-magazines.service");
const create_generated_magazine_dto_1 = require("../dto/create-generated-magazine.dto");
const update_generated_magazine_status_dto_1 = require("../dto/update-generated-magazine-status.dto");
const get_all_report_metrics_dto_1 = require("../dto/get-all-report-metrics.dto");
const auth_service_1 = require("../../../auth/auth.service");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const generated_magazine_1 = require("../domain/generated-magazine");
const update_generated_magazine_dto_1 = require("../dto/update-generated-magazine.dto");
const customer_by_identities_pipe_1 = require("../../../customers/customers/pipes/transform/customer-by-identities.pipe");
const preview_magazine_dto_1 = require("../dto/preview-magazine.dto");
const create_magazine_cover_lead_dto_1 = require("../dto/create-magazine-cover-lead.dto");
const validation_transform_pipe_1 = require("../../../internal/common/pipes/validation-transform.pipe");
const luxon_1 = require("luxon");
const contexts_1 = require("../../../internal/common/contexts");
let GeneratedMagazinesController = class GeneratedMagazinesController {
    constructor(generatedMagazinesService, logger) {
        this.generatedMagazinesService = generatedMagazinesService;
        this.logger = logger;
    }
    create(isPreview, dto, customer) {
        return this.generatedMagazinesService.create(customer, dto, isPreview);
    }
    createMagazineCoverForLead(dto) {
        return this.generatedMagazinesService.createMagazineCoverForLeads(dto);
    }
    findAll(customer) {
        return this.generatedMagazinesService.findAll(customer);
    }
    async getAllGeneratedMagazinesMetrics({ page, perPage }, { year, month }) {
        return this.generatedMagazinesService.getAllGeneratedMagazinesMetrics(page, perPage, year, month);
    }
    async getCountAllGeneratedMagazinesMetrics({ year, month }) {
        return this.generatedMagazinesService.getCountAllGeneratedMagazinesMetrics(year, month);
    }
    find(year, month, customer) {
        return this.generatedMagazinesService.findOne(customer, year, month);
    }
    update(customer, year, month, dto) {
        return this.generatedMagazinesService.update(customer, dto, year, month);
    }
    sendToPrint(customer, id) {
        return this.generatedMagazinesService.sendToPrint(id, customer);
    }
    apiSendToPrint(id) {
        return this.generatedMagazinesService.sendToPrint(id);
    }
    updateStatus(id, dto) {
        this.logger.log({
            payload: {
                usageDate: luxon_1.DateTime.now(),
                data: JSON.stringify(dto),
            },
        }, contexts_1.CONTEXT_GENERATED_MAGAZINE);
        return this.generatedMagazinesService.updateStatus(id, dto);
    }
    updateLeadcoversForMagazine(magazineId, dto) {
        return this.generatedMagazinesService.updateLeadCoversForMagazine(magazineId, dto);
    }
    async getMagazinePreview(dto) {
        return this.generatedMagazinesService.getMagazinePreview(dto);
    }
    getGeneratedMagazineStatusById(id) {
        return this.generatedMagazinesService.getGeneratedMagazineStatusById(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, serialize_interceptor_1.Serialize)(generated_magazine_1.GeneratedMagazineDomain),
    __param(0, (0, common_1.Query)('isPreview')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, create_generated_magazine_dto_1.CreateGeneratedMagazineDto, Object]),
    __metadata("design:returntype", void 0)
], GeneratedMagazinesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('generate-magazine-covers/lead'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_magazine_cover_lead_dto_1.CreateMagazineCoverLeadDto]),
    __metadata("design:returntype", Promise)
], GeneratedMagazinesController.prototype, "createMagazineCoverForLead", null);
__decorate([
    (0, common_1.Get)(),
    (0, serialize_interceptor_1.Serialize)(generated_magazine_1.GeneratedMagazineDomain),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GeneratedMagazinesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('reports/all'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Query)(paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator,
        get_all_report_metrics_dto_1.GetAllReportMetricsDto]),
    __metadata("design:returntype", Promise)
], GeneratedMagazinesController.prototype, "getAllGeneratedMagazinesMetrics", null);
__decorate([
    (0, common_1.Get)('reports/count-all'),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_report_metrics_dto_1.GetAllReportMetricsDto]),
    __metadata("design:returntype", Promise)
], GeneratedMagazinesController.prototype, "getCountAllGeneratedMagazinesMetrics", null);
__decorate([
    (0, common_1.Get)(':year/:month'),
    (0, serialize_interceptor_1.Serialize)(generated_magazine_1.GeneratedMagazineDomain),
    __param(0, (0, common_1.Param)('year')),
    __param(1, (0, common_1.Param)('month')),
    __param(2, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], GeneratedMagazinesController.prototype, "find", null);
__decorate([
    (0, common_1.Patch)(':year/:month'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, serialize_interceptor_1.Serialize)(generated_magazine_1.GeneratedMagazineDomain),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Param)('year')),
    __param(2, (0, common_1.Param)('month')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, update_generated_magazine_dto_1.UpdateGeneratedMagazineDto]),
    __metadata("design:returntype", void 0)
], GeneratedMagazinesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/print'),
    (0, serialize_interceptor_1.Serialize)(generated_magazine_1.GeneratedMagazineDomain),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GeneratedMagazinesController.prototype, "sendToPrint", null);
__decorate([
    (0, auth_service_1.ApiKeyOnly)(),
    (0, common_1.Post)(':id/api/print'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GeneratedMagazinesController.prototype, "apiSendToPrint", null);
__decorate([
    (0, auth_service_1.ApiKeyOnly)(),
    (0, common_1.Patch)(':id/api/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_generated_magazine_status_dto_1.UpdateGeneratedMagazineStatusDto]),
    __metadata("design:returntype", void 0)
], GeneratedMagazinesController.prototype, "updateStatus", null);
__decorate([
    (0, auth_service_1.ApiKeyOnly)(),
    (0, common_1.Patch)(':magazineId'),
    __param(0, (0, common_1.Param)('magazineId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_magazine_cover_lead_dto_1.LeadCoversDto]),
    __metadata("design:returntype", Promise)
], GeneratedMagazinesController.prototype, "updateLeadcoversForMagazine", null);
__decorate([
    (0, common_1.Get)('magazine-preview'),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [preview_magazine_dto_1.PreviewMagazineDto]),
    __metadata("design:returntype", Promise)
], GeneratedMagazinesController.prototype, "getMagazinePreview", null);
__decorate([
    (0, common_1.Get)('generatedMagazine/status/:id'),
    (0, serialize_interceptor_1.Serialize)(generated_magazine_1.GeneratedMagazineDomain),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GeneratedMagazinesController.prototype, "getGeneratedMagazineStatusById", null);
GeneratedMagazinesController = __decorate([
    (0, common_1.Controller)({
        path: 'referral-marketing/generated-magazines',
        version: '1',
    }),
    __metadata("design:paramtypes", [generated_magazines_service_1.GeneratedMagazinesService,
        common_1.Logger])
], GeneratedMagazinesController);
exports.GeneratedMagazinesController = GeneratedMagazinesController;
//# sourceMappingURL=generated-magazines.controller.js.map
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
exports.MagazinesController = void 0;
const common_1 = require("@nestjs/common");
const magazines_service_1 = require("../services/magazines.service");
const create_magazine_dto_1 = require("../dto/create-magazine.dto");
const update_magazine_dto_1 = require("../dto/update-magazine.dto");
const get_all_report_metrics_dto_1 = require("../dto/get-all-report-metrics.dto");
const magazine_1 = require("../domain/magazine");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const customer_by_identities_pipe_1 = require("../../../customers/customers/pipes/transform/customer-by-identities.pipe");
const paginator_1 = require("../../../internal/utils/paginator");
const report_magazines_1 = require("../dto/report-magazines");
const update_magazine_status_dto_1 = require("../dto/update-magazine-status.dto");
const is_admin_pipe_1 = require("../../../customers/customers/pipes/transform/is-admin.pipe");
const validation_transform_pipe_1 = require("../../../internal/common/pipes/validation-transform.pipe");
let MagazinesController = class MagazinesController {
    constructor(magazinesService) {
        this.magazinesService = magazinesService;
    }
    create(dto, customer) {
        return this.magazinesService.create(customer, dto);
    }
    getMagazineData(month, year) {
        const filters = { month, year };
        return this.magazinesService.getMagazinePages(filters);
    }
    findAll(list, customer) {
        return this.magazinesService.findAll(Object.assign({ customer }, list));
    }
    async getMagazineEditingMetrics({ page, perPage }, { year, month }) {
        return this.magazinesService.getMagazineEditingMetrics(page, perPage, year, month);
    }
    async getMagazineSentToPrintMetrics({ page, perPage }, { year, month }) {
        return this.magazinesService.getMagazineSentToPrintMetrics(page, perPage, year, month);
    }
    async getAllMagazinesMetrics(dto) {
        return this.magazinesService.getAllMagazinesMetrics(dto);
    }
    findOne(year, month, customer) {
        return this.magazinesService.findOne(customer, year, month);
    }
    async updateMagazineStatus(id, dto) {
        return this.magazinesService.updateStatusByMagazineId(id, dto);
    }
    patch(year, month, dto, customer) {
        return this.magazinesService.update(customer, year, month, dto);
    }
    async getMagazinesMetrics({ page, perPage }, { year, month }) {
        return this.magazinesService.getMagazinesMetrics(page, perPage, year, month);
    }
    async getMagazinesMetricsBySearch({ page, perPage }, { searchQuery, year, month }) {
        return this.magazinesService.getMagazinesMetricsBySearch(searchQuery, year, month, page, perPage);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, serialize_interceptor_1.Serialize)(magazine_1.MagazineDomain),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_magazine_dto_1.CreateMagazineDto, Object]),
    __metadata("design:returntype", void 0)
], MagazinesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/pages'),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MagazinesController.prototype, "getMagazineData", null);
__decorate([
    (0, common_1.Get)(),
    (0, serialize_interceptor_1.Serialize)(magazine_1.MagazineDomain),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MagazinesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('reports/magazine-editing'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Query)(paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator,
        report_magazines_1.ReportMagazinesDto]),
    __metadata("design:returntype", Promise)
], MagazinesController.prototype, "getMagazineEditingMetrics", null);
__decorate([
    (0, common_1.Get)('reports/magazine-sent-to-print'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Query)(paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator,
        report_magazines_1.ReportMagazinesDto]),
    __metadata("design:returntype", Promise)
], MagazinesController.prototype, "getMagazineSentToPrintMetrics", null);
__decorate([
    (0, common_1.Get)('reports/all'),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_report_metrics_dto_1.GetAllReportMetricsDto]),
    __metadata("design:returntype", Promise)
], MagazinesController.prototype, "getAllMagazinesMetrics", null);
__decorate([
    (0, common_1.Get)(':year/:month'),
    (0, serialize_interceptor_1.Serialize)(magazine_1.MagazineDomain),
    __param(0, (0, common_1.Param)('year')),
    __param(1, (0, common_1.Param)('month')),
    __param(2, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], MagazinesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(is_admin_pipe_1.IsAdmin),
    (0, common_1.Patch)('update-status/:id'),
    (0, serialize_interceptor_1.Serialize)(magazine_1.MagazineDomain),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_magazine_status_dto_1.UpdateMagazineStatusDto]),
    __metadata("design:returntype", Promise)
], MagazinesController.prototype, "updateMagazineStatus", null);
__decorate([
    (0, common_1.Patch)(':year/:month'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    (0, serialize_interceptor_1.Serialize)(magazine_1.MagazineDomain),
    __param(0, (0, common_1.Param)('year')),
    __param(1, (0, common_1.Param)('month')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_magazine_dto_1.UpdateMagazineDto, Object]),
    __metadata("design:returntype", void 0)
], MagazinesController.prototype, "patch", null);
__decorate([
    (0, common_1.Get)('reports'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Query)(paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator,
        report_magazines_1.ReportMagazinesDto]),
    __metadata("design:returntype", Promise)
], MagazinesController.prototype, "getMagazinesMetrics", null);
__decorate([
    (0, common_1.Get)('metrics/reports/search'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Query)(paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator,
        report_magazines_1.ReportMagazinesDto]),
    __metadata("design:returntype", Promise)
], MagazinesController.prototype, "getMagazinesMetricsBySearch", null);
MagazinesController = __decorate([
    (0, common_1.Controller)({
        path: 'referral-marketing/magazines',
        version: '1',
    }),
    __metadata("design:paramtypes", [magazines_service_1.MagazinesService])
], MagazinesController);
exports.MagazinesController = MagazinesController;
//# sourceMappingURL=magazines.controller.js.map
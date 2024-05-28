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
exports.UpsellController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../auth/auth.service");
const set_customer_password_dto_1 = require("./dto/set-customer-password.dto");
const market_and_sales_params_dto_1 = require("./dto/market-and-sales-params.dto");
const upsell_service_1 = require("./upsell.service");
const is_admin_guard_1 = require("../../internal/common/guards/is-admin.guard");
const validation_transform_pipe_1 = require("../../internal/common/pipes/validation-transform.pipe");
const paginator_1 = require("../../internal/utils/paginator");
const find_upsell_report_dto_1 = require("./dto/find-upsell-report.dto");
let UpsellController = class UpsellController {
    constructor(upsellService) {
        this.upsellService = upsellService;
    }
    async setCustomerPassword(dto) {
        return this.upsellService.setCustomerPassword(dto);
    }
    updateParams(MarketingAndSalesParams) {
        return this.upsellService.updateSessionWithParams(MarketingAndSalesParams);
    }
    async findAllPaginated(dto, filter, { page, perPage }) {
        return this.upsellService.findAllPaginated(dto, filter, page, perPage);
    }
    async sendCsvToEmail(dto) {
        return this.upsellService.sendCsvToEmail(dto, dto.filter);
    }
    async deleteRecord(id) {
        return this.upsellService.deleteRecord(id);
    }
};
__decorate([
    (0, auth_service_1.ApiKeyOnly)(),
    (0, common_1.Post)('customer/set-password'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [set_customer_password_dto_1.SetCustomerPasswordDTO]),
    __metadata("design:returntype", Promise)
], UpsellController.prototype, "setCustomerPassword", null);
__decorate([
    (0, common_1.Post)('update-params'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [market_and_sales_params_dto_1.MarketingAndSalesParamsDTO]),
    __metadata("design:returntype", void 0)
], UpsellController.prototype, "updateParams", null);
__decorate([
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Get)('find'),
    __param(0, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_upsell_report_dto_1.FindUpsellReportDto,
        find_upsell_report_dto_1.ColumnFilterDto,
        paginator_1.Paginator]),
    __metadata("design:returntype", Promise)
], UpsellController.prototype, "findAllPaginated", null);
__decorate([
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Post)('export'),
    __param(0, (0, common_1.Body)(validation_transform_pipe_1.ValidationTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_upsell_report_dto_1.UpsellCSVExportDTO]),
    __metadata("design:returntype", Promise)
], UpsellController.prototype, "sendCsvToEmail", null);
__decorate([
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UpsellController.prototype, "deleteRecord", null);
UpsellController = __decorate([
    (0, common_1.Controller)({
        path: 'upsell',
        version: '1',
    }),
    __metadata("design:paramtypes", [upsell_service_1.UpsellService])
], UpsellController);
exports.UpsellController = UpsellController;
//# sourceMappingURL=upsell.controller.js.map
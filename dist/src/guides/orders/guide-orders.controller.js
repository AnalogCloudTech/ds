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
exports.GuideOrdersController = void 0;
const serialize_interceptor_1 = require("../../internal/common/interceptors/serialize.interceptor");
const guide_orders_service_1 = require("./guide-orders.service");
const common_1 = require("@nestjs/common");
const guide_orders_1 = require("./domain/guide-orders");
const create_guide_order_dto_1 = require("./dto/create-guide-order.dto");
const validation_transform_pipe_1 = require("../../internal/common/pipes/validation-transform.pipe");
const customer_by_identities_pipe_1 = require("../../customers/customers/pipes/transform/customer-by-identities.pipe");
const is_admin_guard_1 = require("../../internal/common/guards/is-admin.guard");
const paginator_1 = require("../../internal/utils/paginator");
let GuideOrdersController = class GuideOrdersController {
    constructor(service) {
        this.service = service;
    }
    create(dto, customer) {
        return this.service.create(dto, customer);
    }
    insertMany(orders, sessionId, customer) {
        return this.service.insertMany(orders, sessionId, customer);
    }
    async orders(customer, { page, perPage }) {
        return this.service.orders(customer._id, page, perPage);
    }
    async guideDetails(guideId) {
        return this.service.guideDetails(guideId);
    }
    async getLatestOrder(customer, guideId) {
        return this.service.getLatestOrder(customer._id, guideId);
    }
    async find(id) {
        return this.service.find(id);
    }
    update(id, body) {
        return this.service.update(id, body);
    }
};
__decorate([
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_guide_order_dto_1.CreateGuideOrderDto, Object]),
    __metadata("design:returntype", void 0)
], GuideOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    (0, common_1.Post)('/multiple-order'),
    __param(0, (0, common_1.Body)('orders')),
    __param(1, (0, common_1.Body)('sessionId')),
    __param(2, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, Object]),
    __metadata("design:returntype", void 0)
], GuideOrdersController.prototype, "insertMany", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, paginator_1.Paginator]),
    __metadata("design:returntype", Promise)
], GuideOrdersController.prototype, "orders", null);
__decorate([
    (0, common_1.Get)('/guide-details'),
    __param(0, (0, common_1.Query)('guideId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuideOrdersController.prototype, "guideDetails", null);
__decorate([
    (0, common_1.Get)('/latest'),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Query)('guideId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GuideOrdersController.prototype, "getLatestOrder", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GuideOrdersController.prototype, "find", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(guide_orders_1.GuideOrders),
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_guide_order_dto_1.UpdateGuideDto]),
    __metadata("design:returntype", void 0)
], GuideOrdersController.prototype, "update", null);
GuideOrdersController = __decorate([
    (0, common_1.Controller)({ path: 'guide-orders', version: '1' }),
    __metadata("design:paramtypes", [guide_orders_service_1.GuideOrdersService])
], GuideOrdersController);
exports.GuideOrdersController = GuideOrdersController;
//# sourceMappingURL=guide-orders.controller.js.map
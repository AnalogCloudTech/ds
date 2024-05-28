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
exports.CustomerMilestoneController = void 0;
const common_1 = require("@nestjs/common");
const is_admin_guard_1 = require("../../internal/common/guards/is-admin.guard");
const paginator_1 = require("../../internal/utils/paginator");
const customer_milestone_service_1 = require("./customer-milestone.service");
let CustomerMilestoneController = class CustomerMilestoneController {
    constructor(customerMilestoneService) {
        this.customerMilestoneService = customerMilestoneService;
    }
    async findAll({ page, perPage }) {
        return this.customerMilestoneService.findAll({}, null, page, perPage);
    }
};
__decorate([
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }), paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator]),
    __metadata("design:returntype", Promise)
], CustomerMilestoneController.prototype, "findAll", null);
CustomerMilestoneController = __decorate([
    (0, common_1.Controller)({ path: 'customer-milestones', version: '1' }),
    __metadata("design:paramtypes", [customer_milestone_service_1.CustomerMilestoneService])
], CustomerMilestoneController);
exports.CustomerMilestoneController = CustomerMilestoneController;
//# sourceMappingURL=customer-milestone.controller.js.map
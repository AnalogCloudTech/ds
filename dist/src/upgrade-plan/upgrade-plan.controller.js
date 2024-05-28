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
exports.UpgradePlanController = void 0;
const common_1 = require("@nestjs/common");
const paymentProfile_dto_1 = require("./dto/paymentProfile.dto");
const upgrade_plan_service_1 = require("./upgrade-plan.service");
const customer_by_identities_pipe_1 = require("../customers/customers/pipes/transform/customer-by-identities.pipe");
let UpgradePlanController = class UpgradePlanController {
    constructor(upgradePlanService) {
        this.upgradePlanService = upgradePlanService;
    }
    planUpgrade(upgradePlanDto, customer) {
        return this.upgradePlanService.planUpgrade(customer, upgradePlanDto);
    }
    async identifyAccount(customer) {
        const { email } = customer;
        return this.upgradePlanService.identifyAccount(email);
    }
    async migrateSubscription(customer, planComponentHandle) {
        const { email } = customer;
        return this.upgradePlanService.migrateSubscription(email, planComponentHandle);
    }
};
__decorate([
    (0, common_1.Post)('/plan-upgrade/'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paymentProfile_dto_1.UpgradePlanDto, Object]),
    __metadata("design:returntype", Promise)
], UpgradePlanController.prototype, "planUpgrade", null);
__decorate([
    (0, common_1.Get)('/identify-account'),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UpgradePlanController.prototype, "identifyAccount", null);
__decorate([
    (0, common_1.Post)('/migrate-subscription/:planComponentHandle'),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Param)('planComponentHandle')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UpgradePlanController.prototype, "migrateSubscription", null);
UpgradePlanController = __decorate([
    (0, common_1.Controller)({ path: 'upgrade-plan', version: '1' }),
    __metadata("design:paramtypes", [upgrade_plan_service_1.UpgradePlanService])
], UpgradePlanController);
exports.UpgradePlanController = UpgradePlanController;
//# sourceMappingURL=upgrade-plan.controller.js.map
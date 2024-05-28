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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const subscription_dto_1 = require("./dto/subscription.dto");
const customer_dto_1 = require("./dto/customer.dto");
const payments_service_1 = require("./payments.service");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async createSubscription(createSubscriptionDto) {
        return this.paymentsService.createSubscription(createSubscriptionDto);
    }
    async upgradeSubscription(upgradeSubscriptionDto) {
        return this.paymentsService.upgradeSubscription(upgradeSubscriptionDto);
    }
    async getProration(subscriptionProrationDto, request) {
        const email = (0, lodash_1.get)(request, ['user', 'email']);
        return this.paymentsService.getProration(email, subscriptionProrationDto);
    }
    async createOrUpdateCustomer(customer) {
        return this.paymentsService.createOrUpdateCustomer(customer);
    }
    async findCustomerByEmail(email) {
        return this.paymentsService.findCustomerByEmail(email);
    }
    async getPaymentMethods(request) {
        const email = (0, lodash_1.get)(request, ['user', 'email']);
        return this.paymentsService.getPaymentMethods(email);
    }
    async getPayments(request) {
        const email = (0, lodash_1.get)(request, ['user', 'email']);
        return this.paymentsService.getInvoices(email);
    }
    async getSubscriptionByCustomer(request, active) {
        const email = (0, lodash_1.get)(request, ['user', 'email']);
        const filterActive = active === 'true' || active === true;
        return this.paymentsService.getSubscriptionByCustomer(email, filterActive);
    }
    getCustomer(id) {
        return this.paymentsService.getCustomer(id);
    }
    updateCustomer(customer, id) {
        return this.paymentsService.updateCustomer(id, customer);
    }
    async productPackages(filters, request) {
        const plusPlan = (0, lodash_1.get)(filters, 'plusPlan');
        const email = (0, lodash_1.get)(request, ['user', 'email']);
        return this.paymentsService.getPlans(email, plusPlan);
    }
};
__decorate([
    (0, common_1.Post)('subscription'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscription_dto_1.CreateSubscriptionDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createSubscription", null);
__decorate([
    (0, common_1.Patch)('subscription/upgrade'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscription_dto_1.UpgradeSubscriptionDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "upgradeSubscription", null);
__decorate([
    (0, common_1.Post)('subscription/proration'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscription_dto_1.SubscriptionProrationDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getProration", null);
__decorate([
    (0, common_1.Post)('customer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_dto_1.Customer]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createOrUpdateCustomer", null);
__decorate([
    (0, common_1.Get)('customer/search'),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findCustomerByEmail", null);
__decorate([
    (0, common_1.Get)('customer/payment-methods'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPaymentMethods", null);
__decorate([
    (0, common_1.Get)('customer/payments'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Get)('customer/subscription'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getSubscriptionByCustomer", null);
__decorate([
    (0, common_1.Get)('customer/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getCustomer", null);
__decorate([
    (0, common_1.Patch)('customer/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_dto_1.Customer, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "updateCustomer", null);
__decorate([
    (0, common_1.Get)('product-plans'),
    __param(0, (0, common_1.Query)('filters')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "productPackages", null);
PaymentsController = __decorate([
    (0, common_1.Controller)({ path: 'payments', version: '1' }),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
exports.PaymentsController = PaymentsController;
//# sourceMappingURL=payments.controller.js.map
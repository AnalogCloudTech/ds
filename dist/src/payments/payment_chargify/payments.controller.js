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
exports.PaymentChargifyController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const lodash_1 = require("lodash");
const url_1 = require("../../internal/utils/url");
const subscription_dto_1 = require("./dto/subscription.dto");
const invoice_dto_1 = require("./dto/invoice.dto");
const payment_dto_1 = require("./dto/payment.dto");
const paymentProfile_dto_1 = require("./dto/paymentProfile.dto");
const payments_constants_1 = require("./payments.constants");
const components_dto_1 = require("./dto/components.dto");
const customer_by_identities_pipe_1 = require("../../customers/customers/pipes/transform/customer-by-identities.pipe");
const payments_gateway_1 = require("./gateways/payments.gateway");
const auth_service_1 = require("../../auth/auth.service");
const payment_status_dto_1 = require("./dto/payment-status.dto");
const date_range_dto_1 = require("../../internal/common/dtos/date-range.dto");
const paginator_1 = require("../../internal/utils/paginator");
const types_1 = require("../../customers/customers/domain/types");
let PaymentChargifyController = class PaymentChargifyController {
    constructor(paymentChargifyService, paymentsWebsocketGateway) {
        this.paymentChargifyService = paymentChargifyService;
        this.paymentsWebsocketGateway = paymentsWebsocketGateway;
    }
    async getPaymentProfilesFromEmail(request, body) {
        var _a;
        const email = ((_a = (0, lodash_1.get)(request, ['user', 'email'])) !== null && _a !== void 0 ? _a : (0, lodash_1.get)(body, ['user', 'email']));
        if ((0, lodash_1.isEmpty)(email) || (0, lodash_1.isNull)(email)) {
            throw new common_1.NotFoundException('Customer Not Found');
        }
        return this.paymentChargifyService.getPaymentProfilesFromEmail(email);
    }
    async getPaymentProfilesListFromEmail(customer) {
        const { email } = customer;
        return this.paymentChargifyService.getPaymentProfilesListFromEmail(email);
    }
    async getShowCreditsButton(customer) {
        const { email, accountType } = customer;
        if (accountType === types_1.AccountType.DENTIST) {
            return true;
        }
        return this.paymentChargifyService.getShowCreditsButton(email);
    }
    async getMemberActiveList({ page, perPage }, { startDate, endDate }, customer) {
        return this.paymentChargifyService.getBillingHistory(customer, startDate, endDate, Number(page), Number(perPage));
    }
    async getSubscriptionsFromEmail(request, active = 'false') {
        const email = (0, lodash_1.get)(request, ['user', 'email']);
        const filterActive = payments_constants_1.subscriptionFilters[active];
        return this.paymentChargifyService.getSubscriptionsFromEmail(email, filterActive);
    }
    async getDefaultPaymentProfile(customer) {
        const { email } = customer;
        return await this.paymentChargifyService.getDefaultPaymentProfile(email);
    }
    async changeDefaultPaymentProfile(request, paymentProfileId) {
        const email = (0, lodash_1.get)(request, ['user', 'email']);
        return await this.paymentChargifyService.changeDefaultPaymentProfile(email, paymentProfileId);
    }
    async deletePaymentProfile(profileId, customer) {
        const { email } = customer;
        return this.paymentChargifyService.deletePaymentProfile(profileId, email);
    }
    async updatePaymentProfile(profileId, updatePaymentProfileDto) {
        return this.paymentChargifyService.updatePaymentProfile(profileId, updatePaymentProfileDto);
    }
    async createSubscription(createSubscriptionDto) {
        return this.paymentChargifyService.createSubscription(createSubscriptionDto);
    }
    async updateSubscription(subscriptionId, updateSubscriptionDto) {
        return this.paymentChargifyService.updateSubscription(subscriptionId, updateSubscriptionDto);
    }
    async purgeSubscriptions(subscriptionId, query) {
        const stringifiedParams = (0, url_1.paramsStringify)(query);
        return this.paymentChargifyService.purgeSubscription(subscriptionId, stringifiedParams);
    }
    async createInvoice(subscription_id, createInvoiceDto) {
        return this.paymentChargifyService.createInvoice(subscription_id, createInvoiceDto);
    }
    async voidInvoice(invoiceId, voidInvoiceDto) {
        return this.paymentChargifyService.voidInvoice(invoiceId, voidInvoiceDto);
    }
    async createPayment(invoiceId, voidInvoiceDto) {
        return this.paymentChargifyService.createPayment(invoiceId, voidInvoiceDto);
    }
    async createPaymentProfile(request, createPaymentProfileDto) {
        const email = (0, lodash_1.get)(request, ['user', 'email']);
        return this.paymentChargifyService.createPaymentProfile(email, createPaymentProfileDto);
    }
    async getSubscriptionComponents(subscriptionId) {
        return this.paymentChargifyService.getSubscriptionComponents(subscriptionId);
    }
    async createPreviewAllocation(subscriptionId, createPreviewDto) {
        return this.paymentChargifyService.createPreviewAllocation(subscriptionId, createPreviewDto);
    }
    async allocateComponent(allocationDto) {
        return this.paymentChargifyService.allocateComponent(allocationDto);
    }
    paymentStatus(dto) {
        return this.paymentsWebsocketGateway.sendPaymentStatus(dto);
    }
};
__decorate([
    (0, common_1.Get)('/payment-profiles'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "getPaymentProfilesFromEmail", null);
__decorate([
    (0, common_1.All)('/payment-profiles-list'),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "getPaymentProfilesListFromEmail", null);
__decorate([
    (0, common_1.Get)('/get-show-credits-button'),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "getShowCreditsButton", null);
__decorate([
    (0, common_1.Get)('/get-billing-history'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator,
        date_range_dto_1.default, Object]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "getMemberActiveList", null);
__decorate([
    (0, common_1.Get)('/subscriptions'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "getSubscriptionsFromEmail", null);
__decorate([
    (0, common_1.Get)('/default-payment-profiles'),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "getDefaultPaymentProfile", null);
__decorate([
    (0, common_1.Post)('/payment-profiles/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "changeDefaultPaymentProfile", null);
__decorate([
    (0, common_1.Delete)('/payment-profile/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "deletePaymentProfile", null);
__decorate([
    (0, common_1.Put)('/payment-profile/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, paymentProfile_dto_1.createPaymentProfileDto]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "updatePaymentProfile", null);
__decorate([
    (0, common_1.Post)('/subscription'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscription_dto_1.CreateSubscriptionDto]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "createSubscription", null);
__decorate([
    (0, common_1.Put)('/subscription/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, subscription_dto_1.UpdateSubscriptionDto]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "updateSubscription", null);
__decorate([
    (0, common_1.Post)('/subscription/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, subscription_dto_1.PurgeQuery]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "purgeSubscriptions", null);
__decorate([
    (0, common_1.Post)('/invoice/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, invoice_dto_1.CreateInvoiceDto]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Post)('/invoice-void/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, invoice_dto_1.VoidInvoiceDto]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "voidInvoice", null);
__decorate([
    (0, common_1.Post)('/payment/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payment_dto_1.createPaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Post)('/payment-profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, paymentProfile_dto_1.createPaymentProfileDto]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "createPaymentProfile", null);
__decorate([
    (0, common_1.Get)('/subscription-components/:subscriptionId'),
    __param(0, (0, common_1.Param)('subscriptionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "getSubscriptionComponents", null);
__decorate([
    (0, common_1.Post)('/preview-allocation/:subscriptionId'),
    __param(0, (0, common_1.Param)('subscriptionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, components_dto_1.CreatePreviewAllocationDto]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "createPreviewAllocation", null);
__decorate([
    (0, common_1.Post)('/allocate-component'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [components_dto_1.AllocateComponentDto]),
    __metadata("design:returntype", Promise)
], PaymentChargifyController.prototype, "allocateComponent", null);
__decorate([
    (0, auth_service_1.ApiKeyOnly)(),
    (0, common_1.Post)('payment-status'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_status_dto_1.PaymentStatusDto]),
    __metadata("design:returntype", void 0)
], PaymentChargifyController.prototype, "paymentStatus", null);
PaymentChargifyController = __decorate([
    (0, common_1.Controller)({ path: 'payment-chargify', version: '1' }),
    __metadata("design:paramtypes", [payments_service_1.PaymentChargifyService,
        payments_gateway_1.PaymentsWebsocketGateway])
], PaymentChargifyController);
exports.PaymentChargifyController = PaymentChargifyController;
//# sourceMappingURL=payments.controller.js.map
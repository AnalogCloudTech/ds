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
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = require("stripe");
const webhook_service_1 = require("./webhook.service");
const webhook_idempotency_guard_1 = require("../../onboard/guards/webhook-idempotency.guard");
const onboarding_webhook_guard_1 = require("../../onboard/guards/onboarding-webhook.guard");
const lodash_1 = require("lodash");
const types_1 = require("../chargify/domain/types");
const auth_service_1 = require("../../auth/auth.service");
const afy_logger_service_1 = require("../../integrations/afy-logger/afy-logger.service");
const luxon_1 = require("luxon");
const contexts_1 = require("../../internal/common/contexts");
let WebhookController = class WebhookController {
    constructor(webhookService, loggerServices, logger) {
        this.webhookService = webhookService;
        this.loggerServices = loggerServices;
        this.logger = logger;
    }
    async expiringCard(body) {
        const subscription = (0, lodash_1.get)(body, ['payload', 'subscription']);
        return await this.webhookService.handleExpireCard(subscription);
    }
    async subscriptionStateChange(body) {
        const subscription = (0, lodash_1.get)(body, ['payload', 'subscription']);
        const handle = await this.webhookService.handleSubscriptionStateChange(subscription);
        if (subscription.previous_state === types_1.State.TRIALING &&
            subscription.state === types_1.State.ACTIVE) {
            try {
                await this.loggerServices.sendLogTrialConversion(subscription, 'become-member');
            }
            catch (error) {
                if (error instanceof Error) {
                    const { name, stack, message } = error;
                    this.logger.error({
                        payload: {
                            usageDate: luxon_1.DateTime.now(),
                            name,
                            stack,
                            message,
                        },
                    }, stack, contexts_1.CONTEXT_ERROR);
                }
            }
        }
        return handle;
    }
    async subscriptionUpdated(body) {
        const payload = (0, lodash_1.get)(body, ['payload']);
        return await this.webhookService.handleSubscriptionUpdate(payload);
    }
    paymentFailure(body) {
        return this.webhookService.handlePaymentFailure(body);
    }
    verifyRmmSubscription(body) {
        return this.webhookService.verifyRmmSubscription(body);
    }
    async paymentSuccess(body) {
        const availableFamilyHandles = [
            'click_funnel_family',
            'book_credits_family',
            'guide_credits_family',
            'dentistguide',
            'holiday_sale_credits',
        ];
        const familyHandle = body.payload.subscription.product.product_family.handle;
        if (availableFamilyHandles.includes(familyHandle)) {
            return true;
        }
        if (body.payload.transaction.kind === 'component_proration' &&
            body.payload.transaction.transaction_type === 'payment') {
            return true;
        }
        const handle = await this.webhookService.handlePaymentSuccess(body);
        if (body.payload.subscription.state === types_1.State.TRIALING) {
            try {
                await this.loggerServices.sendLogTrialConversion(body.payload.subscription, 'new-trial');
            }
            catch (error) {
                if (error instanceof Error) {
                    const { name, stack, message } = error;
                    this.logger.error({
                        payload: {
                            usageDate: luxon_1.DateTime.now(),
                            name,
                            stack,
                            message,
                        },
                    }, stack, contexts_1.CONTEXT_ERROR);
                }
            }
        }
        return handle;
    }
    invoiceIssued(body) {
        return this.webhookService.invoiceIssued(body);
    }
    renewalSuccess(body) {
        return this.webhookService.renewalSuccess(body);
    }
    clickFunnels(body) {
        return this.webhookService.clickfunnel(body);
    }
    handleStripeSubscriptionSuccess(body, apiKey) {
        if (!apiKey)
            throw new common_1.HttpException({ message: 'missing apiKey' }, common_1.HttpStatus.BAD_REQUEST);
        return this.webhookService.stripeSubscriptionSuccess(body);
    }
    handleBillingDateChange(body) {
        return this.webhookService.handleBillingDateChange(body);
    }
};
__decorate([
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(webhook_idempotency_guard_1.WebhookIdempotencyGuard),
    (0, common_1.UseGuards)(onboarding_webhook_guard_1.PaymentWebhookSessionGuard),
    (0, common_1.Post)('expiring-card'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.WebhookPayload]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "expiringCard", null);
__decorate([
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(webhook_idempotency_guard_1.WebhookIdempotencyGuard),
    (0, common_1.UseGuards)(onboarding_webhook_guard_1.PaymentWebhookSessionGuard),
    (0, common_1.Post)('subscription-state-change'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.WebhookPayload]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "subscriptionStateChange", null);
__decorate([
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(webhook_idempotency_guard_1.WebhookIdempotencyGuard),
    (0, common_1.UseGuards)(onboarding_webhook_guard_1.PaymentWebhookSessionGuard),
    (0, common_1.Post)('subscription-updated'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.WebhookPayload]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "subscriptionUpdated", null);
__decorate([
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(webhook_idempotency_guard_1.WebhookIdempotencyGuard),
    (0, common_1.UseGuards)(onboarding_webhook_guard_1.PaymentWebhookSessionGuard),
    (0, common_1.Post)('payment-failure'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.WebhookPayload]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "paymentFailure", null);
__decorate([
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(webhook_idempotency_guard_1.WebhookIdempotencyGuard),
    (0, common_1.Post)('verify-rmm-subscription-webhook'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.WebhookPayload]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "verifyRmmSubscription", null);
__decorate([
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(webhook_idempotency_guard_1.WebhookIdempotencyGuard),
    (0, common_1.UseGuards)(onboarding_webhook_guard_1.PaymentWebhookSessionGuard),
    (0, common_1.Post)('payment-success'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.WebhookPayload]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "paymentSuccess", null);
__decorate([
    (0, auth_service_1.Public)(),
    (0, common_1.Post)('invoice-issued'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.WebhookPayload]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "invoiceIssued", null);
__decorate([
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(webhook_idempotency_guard_1.WebhookIdempotencyGuard),
    (0, common_1.Post)('renewal-success'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.WebhookPayload]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "renewalSuccess", null);
__decorate([
    (0, common_1.Post)('click-funnels'),
    (0, auth_service_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "clickFunnels", null);
__decorate([
    (0, common_1.Post)('stripe-payment-success/:apiKey'),
    (0, common_1.UseGuards)(webhook_idempotency_guard_1.WebhookIdempotencyGuard),
    (0, auth_service_1.Public)(),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Param)('apiKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "handleStripeSubscriptionSuccess", null);
__decorate([
    (0, common_1.Post)('billing-date-change'),
    (0, common_1.UseGuards)(webhook_idempotency_guard_1.WebhookIdempotencyGuard),
    (0, auth_service_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.WebhookPayload]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "handleBillingDateChange", null);
WebhookController = __decorate([
    (0, common_1.Controller)({ path: 'webhook', version: '1' }),
    __metadata("design:paramtypes", [webhook_service_1.WebhookService,
        afy_logger_service_1.default,
        common_1.Logger])
], WebhookController);
exports.WebhookController = WebhookController;
//# sourceMappingURL=webhook.controller.js.map
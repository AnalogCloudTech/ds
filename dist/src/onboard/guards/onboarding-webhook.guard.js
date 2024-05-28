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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentWebhookSessionGuard = exports.OnboardingWebhookSessionGuard = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const payments_service_1 = require("../../payments/payment_chargify/payments.service");
let OnboardingWebhookSessionGuard = class OnboardingWebhookSessionGuard {
    constructor(paymentChargify) {
        this.paymentChargify = paymentChargify;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const subscription = ((0, lodash_1.get)(request, ['body', 'payload', 'subscription']));
        const resourceMetaData = await this.paymentChargify.getMetadataForResource('subscriptions', subscription.id);
        const sessionId = resourceMetaData.metadata.find((meta) => meta.name === 'sessionId').value;
        if (!sessionId) {
            throw new common_1.HttpException(Object.assign({ message: 'Payment intent | subscription has no session id. process exited' }, subscription), common_1.HttpStatus.OK);
        }
        request.body.sessionId = sessionId;
        request.body.resourceMetaData = resourceMetaData;
        return true;
    }
};
OnboardingWebhookSessionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payments_service_1.PaymentChargifyService])
], OnboardingWebhookSessionGuard);
exports.OnboardingWebhookSessionGuard = OnboardingWebhookSessionGuard;
let PaymentWebhookSessionGuard = class PaymentWebhookSessionGuard {
    constructor(paymentChargify) {
        this.paymentChargify = paymentChargify;
    }
    async canActivate(context) {
        var _a;
        const request = context.switchToHttp().getRequest();
        const subscription = ((0, lodash_1.get)(request, ['body', 'payload', 'subscription']));
        const resourceMetaData = await this.paymentChargify.getMetadataForResource('subscriptions', subscription === null || subscription === void 0 ? void 0 : subscription.id);
        const sessionId = (_a = resourceMetaData === null || resourceMetaData === void 0 ? void 0 : resourceMetaData.metadata) === null || _a === void 0 ? void 0 : _a.find((meta) => meta.name === 'sessionId');
        request.body.sessionId = sessionId === null || sessionId === void 0 ? void 0 : sessionId.value;
        request.body.resourceMetaData = resourceMetaData;
        return true;
    }
};
PaymentWebhookSessionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payments_service_1.PaymentChargifyService])
], PaymentWebhookSessionGuard);
exports.PaymentWebhookSessionGuard = PaymentWebhookSessionGuard;
//# sourceMappingURL=onboarding-webhook.guard.js.map
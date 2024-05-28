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
exports.PaymentEventsController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../../auth/auth.service");
const validation_transform_pipe_1 = require("../../../internal/common/pipes/validation-transform.pipe");
const types_1 = require("../../../payments/chargify/domain/types");
const payments_service_1 = require("../../../payments/payment_chargify/payments.service");
const afy_payments_services_1 = require("../afy-payments.services");
const types_2 = require("../../../onboard/products/domain/types");
const webhook_service_1 = require("../../../payments/webhook/webhook.service");
const onboard_service_1 = require("../../../onboard/onboard.service");
let PaymentEventsController = class PaymentEventsController {
    constructor(logger, paymentChargifyServices, afyPaymentsServices, webhookServices, onBoardService) {
        this.logger = logger;
        this.paymentChargifyServices = paymentChargifyServices;
        this.afyPaymentsServices = afyPaymentsServices;
        this.webhookServices = webhookServices;
        this.onBoardService = onBoardService;
    }
    async handlePaymentSuccessEvent(data) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (((_b = (_a = data === null || data === void 0 ? void 0 : data.payload) === null || _a === void 0 ? void 0 : _a.transaction) === null || _b === void 0 ? void 0 : _b.kind) === 'component_proration' &&
            ((_d = (_c = data === null || data === void 0 ? void 0 : data.payload) === null || _c === void 0 ? void 0 : _c.transaction) === null || _d === void 0 ? void 0 : _d.transaction_type) === 'payment') {
            return true;
        }
        this.paymentChargifyServices.sendSuccessPaymentEventToSocket({
            id: data.payload.subscription.id.toString(),
            email: data.payload.subscription.customer.email,
        });
        const familyHandle = data.payload.subscription.product.product_family.handle;
        if (types_2.oneTimeProductFamilyHandles.includes(familyHandle)) {
            return this.afyPaymentsServices.handleOneTimePaymentSuccessEvent(data);
        }
        const { metadata } = await this.paymentChargifyServices.getMetadataForResource('subscriptions', (_f = (_e = data === null || data === void 0 ? void 0 : data.payload) === null || _e === void 0 ? void 0 : _e.subscription) === null || _f === void 0 ? void 0 : _f.id);
        if ((metadata === null || metadata === void 0 ? void 0 : metadata.length) === 0) {
            await this.onBoardService.createHubspotDeal(data === null || data === void 0 ? void 0 : data.event, (_g = data === null || data === void 0 ? void 0 : data.payload) === null || _g === void 0 ? void 0 : _g.subscription);
        }
        const sessionMetadata = metadata === null || metadata === void 0 ? void 0 : metadata.find((meta) => (meta === null || meta === void 0 ? void 0 : meta.name) === 'sessionId');
        const offerMetadata = metadata === null || metadata === void 0 ? void 0 : metadata.find((meta) => (meta === null || meta === void 0 ? void 0 : meta.name) === 'offerId');
        const directSaleMetadata = metadata === null || metadata === void 0 ? void 0 : metadata.find((meta) => (meta === null || meta === void 0 ? void 0 : meta.name) === 'directSale');
        if (sessionMetadata && offerMetadata) {
            return;
        }
        if (directSaleMetadata) {
            await this.afyPaymentsServices.handleDirectSalePaymentSuccessEvent(data, offerMetadata);
            return;
        }
        if (offerMetadata) {
            const session = await this.afyPaymentsServices.handleUpsellOfferPaymentSuccessEvent(data, offerMetadata);
            await session.populate(['offer']);
            const offer = session.offer;
            this.paymentChargifyServices.sendSuccessUpsellPaymentEventToSocket({
                id: data.payload.subscription.id.toString(),
                email: data.payload.subscription.customer.email,
                sessionId: session._id,
                offerCode: offer.code,
            });
        }
    }
    async handleSignupSuccessEvent(data) {
        const isRM = await this.webhookServices.verifyRmmSubscription(data);
        if (isRM === null || isRM === void 0 ? void 0 : isRM.message) {
            this.paymentChargifyServices.sendRmSuccessEventToSocket({
                id: data.payload.subscription.id.toString(),
                email: data.payload.subscription.customer.email,
            });
        }
    }
};
__decorate([
    (0, auth_service_1.ApiKeyOnly)(),
    (0, common_1.Post)('/payment-success'),
    __param(0, (0, common_1.Body)(validation_transform_pipe_1.ValidationTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.WebhookPayload]),
    __metadata("design:returntype", Promise)
], PaymentEventsController.prototype, "handlePaymentSuccessEvent", null);
__decorate([
    (0, auth_service_1.ApiKeyOnly)(),
    (0, common_1.Post)('/signup-success'),
    __param(0, (0, common_1.Body)(validation_transform_pipe_1.ValidationTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.WebhookPayload]),
    __metadata("design:returntype", Promise)
], PaymentEventsController.prototype, "handleSignupSuccessEvent", null);
PaymentEventsController = __decorate([
    (0, common_1.Controller)({ path: 'integrations/afy-payments/payment-events', version: '1' }),
    __metadata("design:paramtypes", [common_1.Logger,
        payments_service_1.PaymentChargifyService,
        afy_payments_services_1.AfyPaymentsServices,
        webhook_service_1.WebhookService,
        onboard_service_1.OnboardService])
], PaymentEventsController);
exports.PaymentEventsController = PaymentEventsController;
//# sourceMappingURL=payment-events.controller.js.map
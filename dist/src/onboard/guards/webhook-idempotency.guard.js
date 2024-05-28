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
exports.WebhookIdempotencyGuard = void 0;
const common_1 = require("@nestjs/common");
const onboard_service_1 = require("../onboard.service");
let WebhookIdempotencyGuard = class WebhookIdempotencyGuard {
    constructor(service) {
        this.service = service;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const obj = request.body;
        const objectName = (obj === null || obj === void 0 ? void 0 : obj.event) || (obj === null || obj === void 0 ? void 0 : obj.type);
        const possibleObjectTypes = [
            'payment_success',
            'payment_failure',
            'subscription_product_change',
            'subscription_state_change',
            'component_allocation_change',
            'signup_success',
            'invoice.payment_succeeded',
            'renewal_success',
            'billing_date_change',
        ];
        const isPossibleObjectType = possibleObjectTypes.includes(objectName);
        if (!isPossibleObjectType) {
            throw new common_1.HttpException(null, common_1.HttpStatus.OK);
        }
        const eventId = obj.id;
        if (!eventId) {
            throw new common_1.HttpException(null, common_1.HttpStatus.NO_CONTENT);
        }
        if (objectName === 'payment_method') {
            return true;
        }
        const isRepeated = await this.service.isRepeatedWebhookRequest(eventId, objectName);
        if (isRepeated) {
            throw new common_1.HttpException(null, common_1.HttpStatus.OK);
        }
        return true;
    }
};
WebhookIdempotencyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [onboard_service_1.OnboardService])
], WebhookIdempotencyGuard);
exports.WebhookIdempotencyGuard = WebhookIdempotencyGuard;
//# sourceMappingURL=webhook-idempotency.guard.js.map
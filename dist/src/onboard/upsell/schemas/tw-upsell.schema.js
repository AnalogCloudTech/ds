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
exports.TripWireUpsellSchema = exports.TripWireUpsell = exports.PaymentStatus = exports.PaymentProviders = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var PaymentProviders;
(function (PaymentProviders) {
    PaymentProviders["CHARGIFY"] = "CHARGIFY";
    PaymentProviders["STRIPE"] = "STRIPE";
    PaymentProviders["NONE"] = "NONE";
})(PaymentProviders = exports.PaymentProviders || (exports.PaymentProviders = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["SUCCESS"] = "SUCCESS";
    PaymentStatus["ERROR"] = "ERROR";
    PaymentStatus["UNPAID"] = "UNPAID";
})(PaymentStatus = exports.PaymentStatus || (exports.PaymentStatus = {}));
let TripWireUpsell = class TripWireUpsell {
};
__decorate([
    (0, mongoose_1.Prop)({ ref: 'Customer', type: Object }),
    __metadata("design:type", Object)
], TripWireUpsell.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], TripWireUpsell.prototype, "customerEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ ref: 'Offer', type: Object }),
    __metadata("design:type", Object)
], TripWireUpsell.prototype, "offer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], TripWireUpsell.prototype, "offerName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], TripWireUpsell.prototype, "sessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: PaymentProviders, default: PaymentProviders.NONE }),
    __metadata("design:type", String)
], TripWireUpsell.prototype, "paymentProvider", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: PaymentStatus.UNPAID }),
    __metadata("design:type", String)
], TripWireUpsell.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], TripWireUpsell.prototype, "channel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], TripWireUpsell.prototype, "utmSource", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], TripWireUpsell.prototype, "utmMedium", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], TripWireUpsell.prototype, "utmContent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], TripWireUpsell.prototype, "utmTerm", void 0);
TripWireUpsell = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'ds__tw_upsell' })
], TripWireUpsell);
exports.TripWireUpsell = TripWireUpsell;
exports.TripWireUpsellSchema = mongoose_1.SchemaFactory.createForClass(TripWireUpsell);
//# sourceMappingURL=tw-upsell.schema.js.map
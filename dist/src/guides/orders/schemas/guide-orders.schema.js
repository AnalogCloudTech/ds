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
exports.GuideOrdersSchema = exports.GuideOrders = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const guide_orders_1 = require("../domain/guide-orders");
let GuideOrders = class GuideOrders {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, ref: 'Customer', type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", Object)
], GuideOrders.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Array)
], GuideOrders.prototype, "frontCover", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], GuideOrders.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], GuideOrders.prototype, "practiceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", guide_orders_1.Address)
], GuideOrders.prototype, "practiceAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], GuideOrders.prototype, "practicePhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], GuideOrders.prototype, "practiceEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], GuideOrders.prototype, "practiceLogo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], GuideOrders.prototype, "practiceWebsite", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], GuideOrders.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], GuideOrders.prototype, "guideName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], GuideOrders.prototype, "guideId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], GuideOrders.prototype, "thumbnail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], GuideOrders.prototype, "landingPage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], GuideOrders.prototype, "readPage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: guide_orders_1.OrderStatus, required: false }),
    __metadata("design:type", String)
], GuideOrders.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", guide_orders_1.Address)
], GuideOrders.prototype, "shippingAddress", void 0);
GuideOrders = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'ds__guide_orders',
        optimisticConcurrency: true,
    })
], GuideOrders);
exports.GuideOrders = GuideOrders;
exports.GuideOrdersSchema = mongoose_1.SchemaFactory.createForClass(GuideOrders);
//# sourceMappingURL=guide-orders.schema.js.map
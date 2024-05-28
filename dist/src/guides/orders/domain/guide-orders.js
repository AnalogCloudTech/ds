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
exports.GuideOrders = exports.OrderStatus = exports.Address = exports.FrontCover = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class FrontCover {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], FrontCover.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], FrontCover.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], FrontCover.prototype, "title", void 0);
exports.FrontCover = FrontCover;
class Address {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Address.prototype, "addressLine1", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Address.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Address.prototype, "pincode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Address.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Address.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Address.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Address.prototype, "lastName", void 0);
exports.Address = Address;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Pending"] = "pending";
    OrderStatus["Completed"] = "completed";
    OrderStatus["Cancelled"] = "cancelled";
    OrderStatus["Shipped"] = "shipped";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
class GuideOrders {
}
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], GuideOrders.prototype, "customer", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => FrontCover),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", FrontCover)
], GuideOrders.prototype, "frontCover", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GuideOrders.prototype, "practiceName", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Address),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Address)
], GuideOrders.prototype, "practiceAddress", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GuideOrders.prototype, "practicePhone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GuideOrders.prototype, "practiceLogo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GuideOrders.prototype, "practiceWebsite", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GuideOrders.prototype, "practiceEmail", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], GuideOrders.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GuideOrders.prototype, "thumbnail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GuideOrders.prototype, "guideName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GuideOrders.prototype, "guideId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(OrderStatus),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GuideOrders.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GuideOrders.prototype, "landingPage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GuideOrders.prototype, "readPage", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Address),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Address)
], GuideOrders.prototype, "shippingAddress", void 0);
exports.GuideOrders = GuideOrders;
//# sourceMappingURL=guide-orders.js.map
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
exports.BookCredits = exports.CreditType = void 0;
const serialize_interceptor_1 = require("../../internal/common/interceptors/serialize.interceptor");
const create_product_dto_1 = require("../../onboard/products/dto/create-product.dto");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var CreditType;
(function (CreditType) {
    CreditType["Book"] = "book";
    CreditType["Guide"] = "guide";
    CreditType["HolidaySale"] = "holiday-sale";
})(CreditType = exports.CreditType || (exports.CreditType = {}));
class BookCredits {
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, serialize_interceptor_1.ExposeId)(),
    __metadata("design:type", String)
], BookCredits.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BookCredits.prototype, "credits", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BookCredits.prototype, "perAmount", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], BookCredits.prototype, "totalAmount", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], BookCredits.prototype, "isActive", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsEnum)(CreditType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BookCredits.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => create_product_dto_1.CreateProductDto),
    __metadata("design:type", create_product_dto_1.CreateProductDto)
], BookCredits.prototype, "product", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BookCredits.prototype, "savings", void 0);
exports.BookCredits = BookCredits;
//# sourceMappingURL=book-credits.js.map
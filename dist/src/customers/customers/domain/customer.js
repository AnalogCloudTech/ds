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
exports.Customer = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const address_1 = require("./address");
const attributes_1 = require("./attributes");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const flipping_book_preferences_1 = require("./flipping-book-preferences");
const customer_schema_1 = require("../schemas/customer.schema");
class Customer {
}
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_transformer_1.Expose)(),
    (0, serialize_interceptor_1.ExposeId)(),
    __metadata("design:type", Object)
], Customer.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Customer.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Customer.prototype, "lastName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Customer.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Customer.prototype, "hubspotId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Customer.prototype, "stripeId", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => address_1.Address),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", address_1.Address)
], Customer.prototype, "billing", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => attributes_1.Attributes),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", attributes_1.Attributes)
], Customer.prototype, "attributes", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => flipping_book_preferences_1.FlippingBookPreferences),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", flipping_book_preferences_1.FlippingBookPreferences)
], Customer.prototype, "flippingBookPreferences", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], Customer.prototype, "avatar", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", customer_schema_1.LandingPageWebsite)
], Customer.prototype, "landingPageProfile", void 0);
exports.Customer = Customer;
//# sourceMappingURL=customer.js.map
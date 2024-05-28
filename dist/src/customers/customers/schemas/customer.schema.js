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
exports.CustomerSchema = exports.Customer = exports.LandingPageWebsite = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const types_1 = require("../domain/types");
const utils_1 = require("../../../internal/common/utils");
const attributesDto_1 = require("../dto/attributesDto");
class BookPreferences {
}
class LandingPageWebsite {
}
exports.LandingPageWebsite = LandingPageWebsite;
class LandingPageProfile {
}
class FlippingBookPreferences {
}
class Address {
}
class Attributes extends attributesDto_1.CreateAttributesDto {
}
const defaultSMSPreferences = {
    schedulingCoachReminders: false,
};
let Customer = class Customer extends utils_1.CastableTo {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Customer.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Customer.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Customer.prototype, "hubspotId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Customer.prototype, "stripeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Customer.prototype, "chargifyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BookPreferences }),
    __metadata("design:type", BookPreferences)
], Customer.prototype, "bookPreferences", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: LandingPageProfile }),
    __metadata("design:type", LandingPageProfile)
], Customer.prototype, "landingPageProfile", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Address)
], Customer.prototype, "billing", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        enum: types_1.Status,
        default: types_1.Status.ACTIVE,
    }),
    __metadata("design:type", String)
], Customer.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Attributes, default: null, required: false }),
    __metadata("design:type", Attributes)
], Customer.prototype, "attributes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: FlippingBookPreferences, required: false, default: {} }),
    __metadata("design:type", FlippingBookPreferences)
], Customer.prototype, "flippingBookPreferences", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: '' }),
    __metadata("design:type", String)
], Customer.prototype, "avatar", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: defaultSMSPreferences }),
    __metadata("design:type", Object)
], Customer.prototype, "smsPreferences", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: false,
        default: types_1.AccountType.REALTOR,
        enum: types_1.AccountType,
    }),
    __metadata("design:type", String)
], Customer.prototype, "accountType", void 0);
Customer = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'ds__customers' })
], Customer);
exports.Customer = Customer;
exports.CustomerSchema = mongoose_1.SchemaFactory.createForClass(Customer);
//# sourceMappingURL=customer.schema.js.map
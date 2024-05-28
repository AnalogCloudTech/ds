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
exports.OfferSchema = exports.Offer = exports.Workflow = void 0;
const utils_1 = require("../../internal/common/utils");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const types_1 = require("../domain/types");
class Webinar {
}
class Addon {
}
class ProductInfo {
}
class Workflow {
}
exports.Workflow = Workflow;
let Offer = class Offer extends utils_1.CastableTo {
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, unique: true }),
    __metadata("design:type", String)
], Offer.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Offer.prototype, "credits", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Offer.prototype, "trial", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Offer.prototype, "packages", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Offer.prototype, "packagesCA", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Offer.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ ref: 'Product', type: [mongoose_2.SchemaTypes.ObjectId] }),
    __metadata("design:type", Array)
], Offer.prototype, "products", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Offer.prototype, "productInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Offer.prototype, "description1", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Offer.prototype, "description2", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Offer.prototype, "whatsIncluded", void 0);
__decorate([
    (0, mongoose_1.Prop)({ ref: 'BookOption', type: [mongoose_2.SchemaTypes.ObjectId] }),
    __metadata("design:type", Array)
], Offer.prototype, "bookOptions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ ref: 'BookOption', type: [mongoose_2.SchemaTypes.ObjectId], default: [] }),
    __metadata("design:type", Array)
], Offer.prototype, "nonHeadshotBookOptions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Offer.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Webinar)
], Offer.prototype, "webinar", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Array)
], Offer.prototype, "addons", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: types_1.OfferType }),
    __metadata("design:type", String)
], Offer.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Workflow)
], Offer.prototype, "workFlow", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Offer.prototype, "steps", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Offer.prototype, "value", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: types_1.AccountType, default: types_1.AccountType.REALTOR }),
    __metadata("design:type", String)
], Offer.prototype, "accountType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", Number)
], Offer.prototype, "hubspotListId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Offer.prototype, "skipOnboarding", void 0);
Offer = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'ds__onboard__offers' })
], Offer);
exports.Offer = Offer;
exports.OfferSchema = mongoose_1.SchemaFactory.createForClass(Offer).index({
    type: 1,
    code: 1,
});
//# sourceMappingURL=offer.schema.js.map
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
exports.ContractedOffer = exports.Offer = void 0;
const types_1 = require("./types");
const product_info_1 = require("./product-info");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const book_option_1 = require("./book-option");
const offer_schema_1 = require("../schemas/offer.schema");
class Offer {
    constructor() {
        this.code = null;
        this.title = null;
        this.description1 = null;
        this.description2 = null;
        this.whatsIncluded = [];
        this.image = null;
        this.type = types_1.OfferType.MAIN;
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Offer.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Offer.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], Offer.prototype, "trial", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => product_info_1.ProductInfo),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], Offer.prototype, "productInfo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Offer.prototype, "description1", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Offer.prototype, "description2", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], Offer.prototype, "whatsIncluded", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Offer.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => book_option_1.BookOption),
    __metadata("design:type", Array)
], Offer.prototype, "bookOptions", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Offer.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", offer_schema_1.Workflow)
], Offer.prototype, "workFlow", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Offer.prototype, "accountType", void 0);
exports.Offer = Offer;
class ContractedOffer {
}
exports.ContractedOffer = ContractedOffer;
//# sourceMappingURL=offer.js.map
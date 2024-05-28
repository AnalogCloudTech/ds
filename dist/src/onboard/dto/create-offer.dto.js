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
exports.CreateOfferDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const addon_1 = require("../domain/addon");
const webinar_1 = require("../domain/webinar");
const types_1 = require("../domain/types");
const product_info_1 = require("../domain/product-info");
const offer_schema_1 = require("../schemas/offer.schema");
class CreateOfferDto {
    constructor() {
        this.code = null;
        this.title = null;
        this.description1 = null;
        this.description2 = null;
        this.whatsIncluded = [];
        this.image = null;
        this.type = types_1.OfferType.MAIN;
        this.addons = [];
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], CreateOfferDto.prototype, "trial", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => product_info_1.ProductInfo),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CreateOfferDto.prototype, "productInfo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "description1", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "description2", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CreateOfferDto.prototype, "whatsIncluded", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "image", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", offer_schema_1.Workflow)
], CreateOfferDto.prototype, "workFlow", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => addon_1.Addon),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CreateOfferDto.prototype, "addons", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CreateOfferDto.prototype, "products", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CreateOfferDto.prototype, "bookOptions", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", webinar_1.Webinar)
], CreateOfferDto.prototype, "webinar", void 0);
exports.CreateOfferDto = CreateOfferDto;
//# sourceMappingURL=create-offer.dto.js.map
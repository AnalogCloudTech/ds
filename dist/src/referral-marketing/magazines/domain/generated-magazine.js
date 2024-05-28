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
exports.GeneratedMagazineDomain = void 0;
const class_transformer_1 = require("class-transformer");
const magazine_schema_1 = require("../schemas/magazine.schema");
const magazine_1 = require("./magazine");
const customer_1 = require("../../../customers/customers/domain/customer");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const create_magazine_cover_lead_dto_1 = require("../dto/create-magazine-cover-lead.dto");
class GeneratedMagazineDomain {
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, serialize_interceptor_1.ExposeId)(),
    __metadata("design:type", Object)
], GeneratedMagazineDomain.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => customer_1.Customer),
    __metadata("design:type", customer_1.Customer)
], GeneratedMagazineDomain.prototype, "customer", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => magazine_1.MagazineDomain),
    __metadata("design:type", magazine_schema_1.Magazine)
], GeneratedMagazineDomain.prototype, "magazine", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GeneratedMagazineDomain.prototype, "url", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GeneratedMagazineDomain.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], GeneratedMagazineDomain.prototype, "active", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], GeneratedMagazineDomain.prototype, "isPreview", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GeneratedMagazineDomain.prototype, "coverImage", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GeneratedMagazineDomain.prototype, "flippingBookUrl", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GeneratedMagazineDomain.prototype, "additionalInformation", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GeneratedMagazineDomain.prototype, "pageUrl", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GeneratedMagazineDomain.prototype, "bookUrl", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GeneratedMagazineDomain.prototype, "pageStatus", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], GeneratedMagazineDomain.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], GeneratedMagazineDomain.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GeneratedMagazineDomain.prototype, "coversOnlyUrl", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => create_magazine_cover_lead_dto_1.LeadCoversDto),
    __metadata("design:type", create_magazine_cover_lead_dto_1.LeadCoversDto)
], GeneratedMagazineDomain.prototype, "leadCovers", void 0);
exports.GeneratedMagazineDomain = GeneratedMagazineDomain;
//# sourceMappingURL=generated-magazine.js.map
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
exports.CmsBookDomain = exports.Thumbnail = void 0;
const class_transformer_1 = require("class-transformer");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
class Thumbnail {
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, serialize_interceptor_1.ExposeId)(),
    __metadata("design:type", String)
], Thumbnail.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Thumbnail.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Thumbnail.prototype, "ext", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Thumbnail.prototype, "mime", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)((object) => `${process.env.OLD_CMS_URL}${object.value}`),
    __metadata("design:type", String)
], Thumbnail.prototype, "url", void 0);
exports.Thumbnail = Thumbnail;
class CmsBookDomain {
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, serialize_interceptor_1.ExposeId)(),
    __metadata("design:type", Object)
], CmsBookDomain.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CmsBookDomain.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => Thumbnail),
    __metadata("design:type", Thumbnail)
], CmsBookDomain.prototype, "thumbnail", void 0);
exports.CmsBookDomain = CmsBookDomain;
//# sourceMappingURL=cms-book.js.map
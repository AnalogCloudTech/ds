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
exports.MagazineDomain = void 0;
const class_transformer_1 = require("class-transformer");
const mongoose_1 = require("mongoose");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
let MagazineDomain = class MagazineDomain {
};
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, serialize_interceptor_1.ExposeId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], MagazineDomain.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, serialize_interceptor_1.ExposeId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], MagazineDomain.prototype, "customer", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MagazineDomain.prototype, "month", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MagazineDomain.prototype, "year", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], MagazineDomain.prototype, "selections", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], MagazineDomain.prototype, "magazineId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], MagazineDomain.prototype, "baseReplacers", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MagazineDomain.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MagazineDomain.prototype, "contentUrl", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], MagazineDomain.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], MagazineDomain.prototype, "updatedAt", void 0);
MagazineDomain = __decorate([
    (0, class_transformer_1.Expose)()
], MagazineDomain);
exports.MagazineDomain = MagazineDomain;
//# sourceMappingURL=magazine.js.map
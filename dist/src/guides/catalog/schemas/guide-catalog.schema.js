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
exports.GuideCatalogSchema = exports.GuideCatalog = exports.Type = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var Type;
(function (Type) {
    Type["MAGAZINE"] = "magazine";
    Type["GUIDE"] = "guide";
    Type["BOOK"] = "book";
    Type["PACKET"] = "packet";
})(Type = exports.Type || (exports.Type = {}));
let GuideCatalog = class GuideCatalog {
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], GuideCatalog.prototype, "guideName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], GuideCatalog.prototype, "guideId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], GuideCatalog.prototype, "thumbnail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], GuideCatalog.prototype, "pdfUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], GuideCatalog.prototype, "position", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: Type, required: true }),
    __metadata("design:type", String)
], GuideCatalog.prototype, "type", void 0);
GuideCatalog = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'ds__guide_catalog',
    })
], GuideCatalog);
exports.GuideCatalog = GuideCatalog;
exports.GuideCatalogSchema = mongoose_1.SchemaFactory.createForClass(GuideCatalog);
//# sourceMappingURL=guide-catalog.schema.js.map
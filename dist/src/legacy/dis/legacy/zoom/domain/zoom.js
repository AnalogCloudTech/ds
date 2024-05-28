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
exports.ZoomMember = exports.Zoom = void 0;
const serialize_interceptor_1 = require("../../../../../internal/common/interceptors/serialize.interceptor");
const class_transformer_1 = require("class-transformer");
class Zoom {
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, serialize_interceptor_1.ExposeId)(),
    __metadata("design:type", Object)
], Zoom.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Zoom.prototype, "hostEmail", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Zoom.prototype, "fileLocation", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Zoom.prototype, "bucketName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Zoom.prototype, "keyName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], Zoom.prototype, "topic", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Zoom.prototype, "startTime", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], Zoom.prototype, "zoomCloudDeletedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], Zoom.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], Zoom.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], Zoom.prototype, "deletedAt", void 0);
exports.Zoom = Zoom;
class ZoomMember {
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, serialize_interceptor_1.ExposeId)(),
    __metadata("design:type", Object)
], ZoomMember.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ZoomMember.prototype, "hostEmail", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ZoomMember.prototype, "fullName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], ZoomMember.prototype, "zoomAwsUpload", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], ZoomMember.prototype, "zoomAwsDelete", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], ZoomMember.prototype, "zoomAppInstantDelete", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], ZoomMember.prototype, "zoomAppLaterDelete", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], ZoomMember.prototype, "zoomIQSalesAccount", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ZoomMember.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ZoomMember.prototype, "updatedAt", void 0);
exports.ZoomMember = ZoomMember;
//# sourceMappingURL=zoom.js.map
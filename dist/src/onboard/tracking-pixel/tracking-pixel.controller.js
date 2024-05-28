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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingPixelController = void 0;
const common_1 = require("@nestjs/common");
const tracking_pixel_service_1 = require("./tracking-pixel.service");
const list_tracking_pixels_dto_1 = require("./DTO/list-tracking-pixels.dto");
const validation_transform_pipe_1 = require("../../internal/common/pipes/validation-transform.pipe");
const serialize_interceptor_1 = require("../../internal/common/interceptors/serialize.interceptor");
const tracking_1 = require("./domain/tracking");
const auth_service_1 = require("../../auth/auth.service");
let TrackingPixelController = class TrackingPixelController {
    constructor(service) {
        this.service = service;
    }
    getTrackingListById(dto) {
        return this.service.list(dto);
    }
};
__decorate([
    (0, auth_service_1.Public)(),
    (0, serialize_interceptor_1.Serialize)(tracking_1.TrackingPixelDomain),
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Query)(new validation_transform_pipe_1.ValidationTransformPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_tracking_pixels_dto_1.ListTrackingPixelsDTO]),
    __metadata("design:returntype", Promise)
], TrackingPixelController.prototype, "getTrackingListById", null);
TrackingPixelController = __decorate([
    (0, common_1.Controller)({ path: 'tracking-pixel', version: '1' }),
    __metadata("design:paramtypes", [tracking_pixel_service_1.TrackingPixelService])
], TrackingPixelController);
exports.TrackingPixelController = TrackingPixelController;
//# sourceMappingURL=tracking-pixel.controller.js.map
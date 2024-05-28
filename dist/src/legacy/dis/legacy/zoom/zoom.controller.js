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
exports.ZoomController = void 0;
const common_1 = require("@nestjs/common");
const recording_completed_dto_1 = require("./dto/recording-completed.dto");
const zoom_service_1 = require("./zoom.service");
const express = require("express");
const auth_service_1 = require("../../../../auth/auth.service");
const validation_transform_pipe_1 = require("../../../../internal/common/pipes/validation-transform.pipe");
const paginator_1 = require("../../../../internal/utils/paginator");
const serialize_interceptor_1 = require("../../../../internal/common/interceptors/serialize.interceptor");
const zoom_1 = require("./domain/zoom");
let ZoomController = class ZoomController {
    constructor(zoomService, jwt) {
        this.zoomService = zoomService;
        this.jwt = jwt;
    }
    async createHSCallRecord(recordingCompletedDto) {
        return this.zoomService.handleRecordingCompleted(recordingCompletedDto);
    }
    async redirectToAudioFile(res, req, id) {
        const audioUrl = this.zoomService.getRecordingAudioUrl(id);
        const { access_token } = await this.zoomService.getAuthToken();
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Authorization', `Bearer ${access_token}`);
        return res.redirect(common_1.HttpStatus.SEE_OTHER, audioUrl);
    }
    async zoomRecordingDownload(recordingData) {
        return this.zoomService.handleZoomRecordingCompleted(recordingData);
    }
    async screenRecordingGetRecords(email, { page, perPage }, filter) {
        return this.zoomService.screenRecordingGetRecords(email, page, perPage, filter);
    }
    screenRecordingPlayVideo(id) {
        return this.zoomService.screenRecordingPlayVideo(id);
    }
    phoneCallZoomUser({ email }) {
        return this.zoomService.phoneCallZoomUser(email);
    }
    getCallLogs(email, nextPageToken, { page, perPage }, filter) {
        return this.zoomService.getCallLogs(email, page, perPage, filter, nextPageToken);
    }
    async downloadCall(id) {
        const url = await this.zoomService.downloadCall(id);
        return url;
    }
    getCoachesList({ email }) {
        return this.zoomService.getCoachesList(email);
    }
    async getZoomMemberDetailsByEmail({ email }) {
        return this.zoomService.zoomMemberGetRecords(email);
    }
    getAllMemberRecords({ page, perPage }) {
        return this.zoomService.getAllMemberRecords(page, perPage);
    }
    zoomMemberRecordAdd(recordingData) {
        return this.zoomService.zoomMemberRecordAdd(recordingData);
    }
    zoomMemberRecordUpdate(recordingData) {
        return this.zoomService.zoomMemberRecordUpdate(recordingData);
    }
    zoomMemberRecordDelete(id) {
        return this.zoomService.zoomMemberRecordDelete(id);
    }
};
__decorate([
    (0, common_1.Post)('phone/recording'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [recording_completed_dto_1.RecordingCompletedDto]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "createHSCallRecord", null);
__decorate([
    (0, auth_service_1.Public)(),
    (0, common_1.Get)('phone/recording/:id'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "redirectToAudioFile", null);
__decorate([
    (0, auth_service_1.ApiKeyOnly)(),
    (0, common_1.Post)('screen/recording-download'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [recording_completed_dto_1.ZoomRecordingObject]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "zoomRecordingDownload", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(zoom_1.Zoom),
    (0, common_1.Get)('screen-recording/get-records/:email'),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __param(2, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, paginator_1.Paginator, Object]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "screenRecordingGetRecords", null);
__decorate([
    (0, common_1.Get)('screen-recording/play-video/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "screenRecordingPlayVideo", null);
__decorate([
    (0, common_1.Get)('phone-call/zoom-user'),
    __param(0, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "phoneCallZoomUser", null);
__decorate([
    (0, common_1.Get)('phone-call/get-call-logs/:email/:nextPageToken'),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Param)('nextPageToken')),
    __param(2, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __param(3, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, paginator_1.Paginator, Object]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "getCallLogs", null);
__decorate([
    (0, common_1.Get)('phone-call/download-call/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "downloadCall", null);
__decorate([
    (0, common_1.Get)('screen-recording/get-coaches-list'),
    __param(0, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "getCoachesList", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(zoom_1.ZoomMember),
    (0, common_1.Get)('zoom-member/member-property'),
    __param(0, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "getZoomMemberDetailsByEmail", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(zoom_1.ZoomMember),
    (0, common_1.Get)('zoom-member/all-member-property'),
    __param(0, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "getAllMemberRecords", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(zoom_1.ZoomMember),
    (0, common_1.Post)('zoom-member/add-member-property'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "zoomMemberRecordAdd", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(zoom_1.ZoomMember),
    (0, common_1.Patch)('zoom-member/update-member-property'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "zoomMemberRecordUpdate", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(zoom_1.ZoomMember),
    (0, common_1.Delete)('zoom-member/delete-member-property/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ZoomController.prototype, "zoomMemberRecordDelete", null);
ZoomController = __decorate([
    (0, common_1.Controller)({ path: 'zoom', version: '1' }),
    __param(1, (0, common_1.Inject)('ZOOM_JWT_TOKEN')),
    __metadata("design:paramtypes", [zoom_service_1.ZoomService, Object])
], ZoomController);
exports.ZoomController = ZoomController;
//# sourceMappingURL=zoom.controller.js.map
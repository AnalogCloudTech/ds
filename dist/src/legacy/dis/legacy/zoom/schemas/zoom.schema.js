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
exports.ZoomRecordingSchema = exports.ZoomRecording = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_transformer_1 = require("class-transformer");
let ZoomRecording = class ZoomRecording {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ZoomRecording.prototype, "hostEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ZoomRecording.prototype, "fileLocation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ZoomRecording.prototype, "bucketName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ZoomRecording.prototype, "keyName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ZoomRecording.prototype, "zoomMeetingId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ZoomRecording.prototype, "zoomMeetinguuid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ZoomRecording.prototype, "topic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], ZoomRecording.prototype, "zoomCloudDeletedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ZoomRecording.prototype, "customerName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ZoomRecording.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], ZoomRecording.prototype, "deletedAt", void 0);
ZoomRecording = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'ds__zoom_recording',
    })
], ZoomRecording);
exports.ZoomRecording = ZoomRecording;
exports.ZoomRecordingSchema = mongoose_1.SchemaFactory.createForClass(ZoomRecording);
//# sourceMappingURL=zoom.schema.js.map
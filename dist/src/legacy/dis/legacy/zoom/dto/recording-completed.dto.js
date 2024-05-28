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
exports.ZoomRecordingObject = exports.ZoomRecordingFile = exports.FileType = exports.FileExt = exports.RecordingCompletedDto = exports.RecordingCompletedPayloadDto = exports.RecordingCompletedPayloadObjectDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class RecordingCompletedPayloadObjectDto {
}
exports.RecordingCompletedPayloadObjectDto = RecordingCompletedPayloadObjectDto;
class RecordingCompletedPayloadDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordingCompletedPayloadDto.prototype, "account_id", void 0);
exports.RecordingCompletedPayloadDto = RecordingCompletedPayloadDto;
class RecordingCompletedDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordingCompletedDto.prototype, "event", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RecordingCompletedPayloadDto),
    __metadata("design:type", RecordingCompletedPayloadDto)
], RecordingCompletedDto.prototype, "payload", void 0);
exports.RecordingCompletedDto = RecordingCompletedDto;
var FileExt;
(function (FileExt) {
    FileExt[FileExt["MP4"] = 0] = "MP4";
    FileExt[FileExt["M4A"] = 1] = "M4A";
    FileExt[FileExt["TXT"] = 2] = "TXT";
    FileExt[FileExt["VTT"] = 3] = "VTT";
    FileExt[FileExt["CSV"] = 4] = "CSV";
    FileExt[FileExt["JSON"] = 5] = "JSON";
    FileExt[FileExt["JPG"] = 6] = "JPG";
})(FileExt = exports.FileExt || (exports.FileExt = {}));
var FileType;
(function (FileType) {
    FileType[FileType["MP4"] = 0] = "MP4";
    FileType[FileType["M4A"] = 1] = "M4A";
    FileType[FileType["CHAT"] = 2] = "CHAT";
    FileType[FileType["TRANSCRIPT"] = 3] = "TRANSCRIPT";
    FileType[FileType["CSV"] = 4] = "CSV";
    FileType[FileType["TB"] = 5] = "TB";
    FileType[FileType["CC"] = 6] = "CC";
    FileType[FileType["CHAT_MESSAGE"] = 7] = "CHAT_MESSAGE";
    FileType[FileType["SUMMARY"] = 8] = "SUMMARY";
    FileType[FileType["TIMELINE"] = 9] = "TIMELINE";
})(FileType = exports.FileType || (exports.FileType = {}));
class ZoomRecordingFile {
}
exports.ZoomRecordingFile = ZoomRecordingFile;
class ZoomRecordingObject {
}
exports.ZoomRecordingObject = ZoomRecordingObject;
//# sourceMappingURL=recording-completed.dto.js.map
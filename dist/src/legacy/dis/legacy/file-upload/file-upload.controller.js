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
exports.FileUploadController = void 0;
const file_upload_service_1 = require("./file-upload.service");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const auth_service_1 = require("../../../../auth/auth.service");
let FileUploadController = class FileUploadController {
    constructor(fileUploadService) {
        this.fileUploadService = fileUploadService;
    }
    async uploadFile(file) {
        try {
            return await this.fileUploadService.uploadPublicFile(file.buffer, file.mimetype);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new common_1.HttpException(error.response.data, error.response.status);
            }
        }
    }
};
__decorate([
    (0, common_1.Post)('file'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "uploadFile", null);
FileUploadController = __decorate([
    (0, auth_service_1.Public)(),
    (0, common_1.Controller)({ path: 'upload', version: '1' }),
    __metadata("design:paramtypes", [file_upload_service_1.FileUploadService])
], FileUploadController);
exports.FileUploadController = FileUploadController;
//# sourceMappingURL=file-upload.controller.js.map
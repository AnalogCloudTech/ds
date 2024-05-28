"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadModule = void 0;
const common_1 = require("@nestjs/common");
const file_upload_service_1 = require("./file-upload.service");
const file_upload_controller_1 = require("./file-upload.controller");
const config_1 = require("@nestjs/config");
const aws_sdk_1 = require("aws-sdk");
let FileUploadModule = class FileUploadModule {
};
FileUploadModule = __decorate([
    (0, common_1.Module)({
        providers: [
            file_upload_service_1.FileUploadService,
            {
                provide: 'BUCKET_NAME',
                useFactory: (configService) => {
                    return configService.get('aws.publicBucketName');
                },
                inject: [config_1.ConfigService],
            },
            {
                provide: 'S3',
                useClass: aws_sdk_1.S3,
            },
        ],
        controllers: [file_upload_controller_1.FileUploadController],
    })
], FileUploadModule);
exports.FileUploadModule = FileUploadModule;
//# sourceMappingURL=file-upload.module.js.map
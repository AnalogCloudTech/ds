"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsModule = void 0;
const common_1 = require("@nestjs/common");
const uploads_service_1 = require("./uploads.service");
const uploads_controller_1 = require("./uploads.controller");
const mongoose_1 = require("@nestjs/mongoose");
const upload_schema_1 = require("./schemas/upload.schema");
const s3_module_1 = require("../internal/libs/aws/s3/s3.module");
const uploads_repository_1 = require("./uploads.repository");
let UploadsModule = class UploadsModule {
};
UploadsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: upload_schema_1.Upload.name, schema: upload_schema_1.UploadSchema }]),
            s3_module_1.S3Module,
        ],
        controllers: [uploads_controller_1.UploadsController],
        providers: [uploads_service_1.UploadsService, uploads_controller_1.UploadsController, uploads_repository_1.UploadsRepository],
        exports: [uploads_service_1.UploadsService],
    })
], UploadsModule);
exports.UploadsModule = UploadsModule;
//# sourceMappingURL=uploads.module.js.map
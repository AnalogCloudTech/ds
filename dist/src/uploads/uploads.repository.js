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
exports.UploadsRepository = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const upload_schema_1 = require("./schemas/upload.schema");
const common_1 = require("@nestjs/common");
let UploadsRepository = class UploadsRepository {
    constructor(uploadModel) {
        this.uploadModel = uploadModel;
    }
    create(customer, createUploadDto) {
        const downloadUrl = createUploadDto.uploadUrl.split('?')[0];
        const upload = new this.uploadModel(Object.assign(Object.assign({}, createUploadDto), { customer: customer._id, downloadUrl }));
        return upload.save();
    }
    async findAll(customer) {
        const uploads = await this.uploadModel.find({
            customer: customer._id,
        });
        if (!uploads) {
            throw new common_1.HttpException({ message: 'Upload not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        return uploads;
    }
    async findOne(uploadId, customer) {
        const upload = await this.uploadModel.findOne({
            _id: uploadId,
            customer: customer._id,
        });
        if (!upload) {
            throw new common_1.HttpException({ message: 'Upload not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        return upload;
    }
};
UploadsRepository = __decorate([
    __param(0, (0, mongoose_1.InjectModel)(upload_schema_1.Upload.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UploadsRepository);
exports.UploadsRepository = UploadsRepository;
//# sourceMappingURL=uploads.repository.js.map
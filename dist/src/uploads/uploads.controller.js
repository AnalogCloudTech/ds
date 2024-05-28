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
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const uploads_service_1 = require("./uploads.service");
const create_upload_dto_1 = require("./dto/create-upload.dto");
const customer_by_identities_pipe_1 = require("../customers/customers/pipes/transform/customer-by-identities.pipe");
const upload_1 = require("./domain/upload");
const serialize_interceptor_1 = require("../internal/common/interceptors/serialize.interceptor");
const s3_service_1 = require("../internal/libs/aws/s3/s3.service");
let UploadsController = class UploadsController {
    constructor(uploadsService, s3Service) {
        this.uploadsService = uploadsService;
        this.s3Service = s3Service;
    }
    async create(customer, createUploadDto) {
        const { path = '', ext, bucket, contentType } = createUploadDto;
        const uploadUrl = this.s3Service.preSignedUploadWithCustomer({
            bucket,
            path,
            ext,
            contentType,
            customer,
        });
        return this.uploadsService.create(customer, createUploadDto, uploadUrl);
    }
    findOne(customer, id) {
        return this.uploadsService.findOne(customer, id);
    }
    findAll(customer) {
        return this.uploadsService.findAll(customer);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, serialize_interceptor_1.Serialize)(upload_1.UploadDomain),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_upload_dto_1.CreateUploadDto]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, serialize_interceptor_1.Serialize)(upload_1.UploadDomain),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UploadsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    (0, serialize_interceptor_1.Serialize)(upload_1.UploadDomain),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UploadsController.prototype, "findAll", null);
UploadsController = __decorate([
    (0, common_1.Controller)({ path: 'uploads', version: '1' }),
    __metadata("design:paramtypes", [uploads_service_1.UploadsService,
        s3_service_1.S3Service])
], UploadsController);
exports.UploadsController = UploadsController;
//# sourceMappingURL=uploads.controller.js.map
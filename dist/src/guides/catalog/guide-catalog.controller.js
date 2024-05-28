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
exports.GuideCatalogController = void 0;
const common_1 = require("@nestjs/common");
const guide_catalog_service_1 = require("./guide-catalog.service");
const validation_transform_pipe_1 = require("../../internal/common/pipes/validation-transform.pipe");
const create_guide_catalog_dto_1 = require("./dto/create-guide-catalog.dto");
const serialize_interceptor_1 = require("../../internal/common/interceptors/serialize.interceptor");
const guide_catalog_1 = require("./domain/guide-catalog");
let GuideCatalogController = class GuideCatalogController {
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll() {
        return this.service.findAll();
    }
    find(guideId) {
        return this.service.findOne(guideId);
    }
};
__decorate([
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_guide_catalog_dto_1.CreateGuideCatalogDto]),
    __metadata("design:returntype", void 0)
], GuideCatalogController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GuideCatalogController.prototype, "findAll", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(guide_catalog_1.GuideCatalog),
    (0, common_1.Get)('/filter'),
    __param(0, (0, common_1.Query)('guideId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GuideCatalogController.prototype, "find", null);
GuideCatalogController = __decorate([
    (0, common_1.Controller)({ path: 'guide-catalog', version: '1' }),
    __metadata("design:paramtypes", [guide_catalog_service_1.GuideCatalogService])
], GuideCatalogController);
exports.GuideCatalogController = GuideCatalogController;
//# sourceMappingURL=guide-catalog.controller.js.map
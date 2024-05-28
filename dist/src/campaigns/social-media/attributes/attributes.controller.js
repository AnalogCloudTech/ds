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
exports.AttributesController = void 0;
const paginator_1 = require("../../../internal/utils/paginator");
const common_1 = require("@nestjs/common");
const attributes_service_1 = require("./attributes.service");
const attributes_domain_1 = require("./domain/attributes.domain");
const create_attribute_dto_1 = require("./dto/create-attribute.dto");
const update_attribute_dto_1 = require("./dto/update-attribute.dto");
const customer_by_identities_pipe_1 = require("../../../customers/customers/pipes/transform/customer-by-identities.pipe");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const validation_transform_pipe_1 = require("../../../internal/common/pipes/validation-transform.pipe");
let AttributesController = class AttributesController {
    constructor(attributesService) {
        this.attributesService = attributesService;
    }
    findAllByCutomerId(customer) {
        return this.attributesService.findAllByCustomerId(customer);
    }
    create(customer, createAttributeDto) {
        return this.attributesService.create(customer, createAttributeDto);
    }
    findAll({ page, perPage }) {
        return this.attributesService.findAll(page, perPage);
    }
    findOne(id) {
        return this.attributesService.findOne(id);
    }
    update(id, updateAttributeDto) {
        return this.attributesService.update(id, updateAttributeDto);
    }
    remove(id) {
        return this.attributesService.remove(id);
    }
};
__decorate([
    (0, serialize_interceptor_1.Serialize)(attributes_domain_1.AttributeDomain),
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AttributesController.prototype, "findAllByCutomerId", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(attributes_domain_1.AttributeDomain),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_attribute_dto_1.CreateAttributeDto]),
    __metadata("design:returntype", void 0)
], AttributesController.prototype, "create", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(attributes_domain_1.AttributeDomain),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "findAll", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(attributes_domain_1.AttributeDomain),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttributesController.prototype, "findOne", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(attributes_domain_1.AttributeDomain),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_attribute_dto_1.UpdateAttributeDto]),
    __metadata("design:returntype", void 0)
], AttributesController.prototype, "update", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(attributes_domain_1.AttributeDomain),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttributesController.prototype, "remove", null);
AttributesController = __decorate([
    (0, common_1.Controller)({ path: 'social-media/attributes', version: '1' }),
    __metadata("design:paramtypes", [attributes_service_1.AttributesService])
], AttributesController);
exports.AttributesController = AttributesController;
//# sourceMappingURL=attributes.controller.js.map
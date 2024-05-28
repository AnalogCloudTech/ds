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
exports.CustomerPropertiesController = void 0;
const customer_properties_service_1 = require("./customer-properties.service");
const common_1 = require("@nestjs/common");
const create_customer_properties_dto_1 = require("./dto/create-customer-properties.dto");
const customer_by_identities_pipe_1 = require("../customers/pipes/transform/customer-by-identities.pipe");
const serialize_interceptor_1 = require("../../internal/common/interceptors/serialize.interceptor");
const customer_properties_1 = require("./domain/customer-properties");
const update_customer_properties_dto_1 = require("./dto/update-customer-properties.dto");
let CustomerPropertiesController = class CustomerPropertiesController {
    constructor(service) {
        this.service = service;
    }
    findAll(filter) {
        return this.service.findAll({
            filter,
        });
    }
    create(dto, customer) {
        return this.service.create(dto, customer);
    }
    async update(id, customer, dto) {
        return this.service.update(id, dto, customer);
    }
    async findOneById(id) {
        return this.service.findOne(id);
    }
};
__decorate([
    (0, serialize_interceptor_1.Serialize)(customer_properties_1.CustomerProperties),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('filter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomerPropertiesController.prototype, "findAll", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(customer_properties_1.CustomerProperties),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_properties_dto_1.CreateCustomerPropertiesDto, Object]),
    __metadata("design:returntype", void 0)
], CustomerPropertiesController.prototype, "create", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(customer_properties_1.CustomerProperties),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(2, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_customer_properties_dto_1.UpdateCustomerPropertiesDto]),
    __metadata("design:returntype", Promise)
], CustomerPropertiesController.prototype, "update", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(customer_properties_1.CustomerProperties),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerPropertiesController.prototype, "findOneById", null);
CustomerPropertiesController = __decorate([
    (0, common_1.Controller)({ path: 'customer-properties', version: '1' }),
    __metadata("design:paramtypes", [customer_properties_service_1.CustomerPropertiesService])
], CustomerPropertiesController);
exports.CustomerPropertiesController = CustomerPropertiesController;
//# sourceMappingURL=customer-properties.controller.js.map
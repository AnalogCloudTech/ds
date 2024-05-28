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
exports.CustomerTemplatesController = void 0;
const common_1 = require("@nestjs/common");
const customer_templates_service_1 = require("./customer-templates.service");
const create_customer_template_dto_1 = require("./dto/create-customer-template.dto");
const update_customer_template_dto_1 = require("./dto/update-customer-template.dto");
const customer_by_identities_pipe_1 = require("../../../customers/customers/pipes/transform/customer-by-identities.pipe");
const customer_template_1 = require("./domain/customer-template");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const template_variables_validate_pipe_1 = require("../common/pipes/template-variables.validate.pipe");
const paginator_1 = require("../../../internal/utils/paginator");
const validation_transform_pipe_1 = require("../../../internal/common/pipes/validation-transform.pipe");
let CustomerTemplatesController = class CustomerTemplatesController {
    constructor(customerTemplatesService) {
        this.customerTemplatesService = customerTemplatesService;
    }
    create(customer, createCustomerTemplateDto) {
        const dto = Object.assign(Object.assign({}, createCustomerTemplateDto), { customer: customer._id });
        return this.customerTemplatesService.store(customer, dto);
    }
    findAll(customer, { page, perPage }) {
        return this.customerTemplatesService.findAllByCustomer(customer, page, perPage);
    }
    listDropDown(customer) {
        return this.customerTemplatesService.listDropdown(customer);
    }
    findOne(id) {
        return this.customerTemplatesService.findById(id);
    }
    update(id, updateCustomerTemplateDto) {
        return this.customerTemplatesService.update(id, updateCustomerTemplateDto);
    }
    remove(id) {
        return this.customerTemplatesService.remove(id);
    }
};
__decorate([
    (0, serialize_interceptor_1.Serialize)(customer_template_1.CustomerTemplate),
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Body)(template_variables_validate_pipe_1.TemplateVariablesValidatePipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_customer_template_dto_1.CreateCustomerTemplateDto]),
    __metadata("design:returntype", void 0)
], CustomerTemplatesController.prototype, "create", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(customer_template_1.CustomerTemplate),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, paginator_1.Paginator]),
    __metadata("design:returntype", void 0)
], CustomerTemplatesController.prototype, "findAll", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(customer_template_1.CustomerTemplate),
    (0, common_1.Get)('dropdown/list'),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomerTemplatesController.prototype, "listDropDown", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(customer_template_1.CustomerTemplate),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomerTemplatesController.prototype, "findOne", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(customer_template_1.CustomerTemplate),
    (0, common_1.Patch)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(template_variables_validate_pipe_1.TemplateVariablesValidatePipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_customer_template_dto_1.UpdateCustomerTemplateDto]),
    __metadata("design:returntype", void 0)
], CustomerTemplatesController.prototype, "update", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(customer_template_1.CustomerTemplate),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomerTemplatesController.prototype, "remove", null);
CustomerTemplatesController = __decorate([
    (0, common_1.Controller)({ path: 'email-campaigns/customer-templates', version: '1' }),
    __metadata("design:paramtypes", [customer_templates_service_1.CustomerTemplatesService])
], CustomerTemplatesController);
exports.CustomerTemplatesController = CustomerTemplatesController;
//# sourceMappingURL=customer-templates.controller.js.map
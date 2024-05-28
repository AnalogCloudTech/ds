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
exports.CustomerTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const customer_template_repository_1 = require("./repositories/customer-template.repository");
const cms_service_1 = require("../../../cms/cms/cms.service");
const lodash_1 = require("lodash");
let CustomerTemplatesService = class CustomerTemplatesService {
    constructor(customerTemplateRepository, cmsService) {
        this.customerTemplateRepository = customerTemplateRepository;
        this.cmsService = cmsService;
    }
    async store(customer, createCustomerTemplateDto) {
        const templateData = (0, lodash_1.pick)(createCustomerTemplateDto, [
            'name',
            'content',
            'subject',
            'bodyContent',
            'templateTitle',
            'imageUrl',
            'emailTemplate',
        ]);
        const strapiTemplate = await this.cmsService.createTemplate(customer, templateData);
        return this.customerTemplateRepository.store(Object.assign(Object.assign({}, createCustomerTemplateDto), { templateId: strapiTemplate.id }));
    }
    async findAllByCustomer(customer, page, perPage) {
        const filter = {
            customer: { $eq: customer._id },
        };
        const options = {
            skip: page * perPage,
            sort: { createdAt: 'desc' },
        };
        return this.customerTemplateRepository.findAll(filter, options);
    }
    async listDropdown(customer) {
        const filters = {
            customer: { $eq: customer._id },
        };
        const options = {
            sort: { name: 'asc' },
        };
        const projection = {
            name: true,
            templateId: true,
        };
        return this.customerTemplateRepository.findAll(filters, options, projection);
    }
    async findById(id) {
        return this.customerTemplateRepository.findById(id);
    }
    async update(id, updateCustomerTemplateDto) {
        const { templateId } = await this.customerTemplateRepository.findById(id);
        const templateData = updateCustomerTemplateDto;
        await this.cmsService.updateTemplate(templateId, templateData);
        return this.customerTemplateRepository.update(id, updateCustomerTemplateDto);
    }
    async remove(id) {
        const removed = await this.customerTemplateRepository.delete(id);
        await this.cmsService.deleteTemplate(removed.templateId);
        return removed;
    }
};
CustomerTemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_template_repository_1.CustomerTemplateRepository,
        cms_service_1.CmsService])
], CustomerTemplatesService);
exports.CustomerTemplatesService = CustomerTemplatesService;
//# sourceMappingURL=customer-templates.service.js.map
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
exports.TemplatesService = void 0;
const common_1 = require("@nestjs/common");
const cms_service_1 = require("../../../cms/cms/cms.service");
const common_2 = require("../../../cms/cms/types/common");
const ses_service_1 = require("../../../internal/libs/aws/ses/ses.service");
const constants_1 = require("../../../internal/libs/aws/ses/constants");
const webhook_1 = require("../../../cms/cms/types/webhook");
const services_1 = require("../campaigns/services");
const cms_filter_builder_1 = require("../../../internal/utils/cms/filters/cms.filter.builder");
const cms_populate_builder_1 = require("../../../internal/utils/cms/populate/cms.populate.builder");
const lodash_1 = require("lodash");
const customer_templates_service_1 = require("../customer-templates/customer-templates.service");
let TemplatesService = class TemplatesService {
    constructor(cmsService, sesService, campaignsService, customerTemplatesService) {
        this.cmsService = cmsService;
        this.sesService = sesService;
        this.campaignsService = campaignsService;
        this.customerTemplatesService = customerTemplatesService;
    }
    async list(customer, { page, perPage }) {
        const query = {
            populate: {
                emailTemplates: {
                    filters: {
                        customerId: {
                            $eq: customer._id.toString(),
                        },
                    },
                },
            },
            pagination: {
                page,
                pageSize: perPage,
            },
        };
        const filters = [
            {
                name: 'customerId',
                operator: '$null',
                value: true,
            },
        ];
        const url = cms_populate_builder_1.CmsPopulateBuilder.build(Object.assign(Object.assign({}, query), { publicationState: common_2.PublicationState.LIVE }));
        const queryFilters = cms_filter_builder_1.CmsFilterBuilder.build(filters);
        const fullQuery = `?${url}&${queryFilters}`;
        const list = await this.cmsService.templateListWithPagination(fullQuery);
        const customerTemplateIds = [];
        list.data = list.data.map((template) => {
            var _a;
            if ((0, lodash_1.isEmpty)((_a = template.emailTemplates) === null || _a === void 0 ? void 0 : _a.data)) {
                return template;
            }
            else {
                const [templateData] = template.emailTemplates.data;
                const { id, attributes } = templateData;
                customerTemplateIds.push(id);
                return Object.assign(Object.assign({}, template), { customTemplate: Object.assign({ id }, attributes) });
            }
        });
        if (customerTemplateIds.length) {
            const customerTemplates = await this.customerTemplatesService.findAllByCustomer(customer, 0, customerTemplateIds.length);
            list.data = list.data.map((template) => {
                if ((0, lodash_1.isEmpty)(template.customTemplate)) {
                    return template;
                }
                else {
                    const { _id } = customerTemplates.find((customerTemplate) => {
                        return customerTemplate.templateId === template.customTemplate.id;
                    });
                    template.customTemplate.customerTemplateId = _id.toString();
                    return template;
                }
            });
        }
        return list;
    }
    listDropdown() {
        return this.cmsService.templateListDropdown();
    }
    async templateDetails(templateId) {
        const query = {
            publicationState: common_2.PublicationState.LIVE,
            populate: '*',
        };
        return this.cmsService.templateDetails(templateId, query);
    }
    async handleCmsWebhook(event) {
        if (event.model !== webhook_1.Models.EMAIL_TEMPLATE) {
            return;
        }
        const templateId = event.entry.customerId
            ? (0, constants_1.buildCustomerTemplateName)(event.entry.id)
            : (0, constants_1.buildTemplateName)(event.entry.id);
        switch (event.event) {
            case webhook_1.EventType.ENTRY_UPDATE:
                return this.sesService.updateTemplate(templateId, event.entry.subject, event.entry.content);
            case webhook_1.EventType.ENTRY_CREATE:
                return this.sesService.createTemplate(templateId, event.entry.subject, event.entry.content);
            case webhook_1.EventType.ENTRY_DELETE:
                return this.deleteTemplate(templateId, event.entry.id);
            default:
                return null;
        }
    }
    async deleteTemplate(templateName, templateId) {
        await this.campaignsService.cancelCampaignsByTemplateId(templateId);
        return this.sesService.deleteTemplate(templateName);
    }
};
TemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cms_service_1.CmsService,
        ses_service_1.SesService,
        services_1.CampaignsService,
        customer_templates_service_1.CustomerTemplatesService])
], TemplatesService);
exports.TemplatesService = TemplatesService;
//# sourceMappingURL=templates.service.js.map
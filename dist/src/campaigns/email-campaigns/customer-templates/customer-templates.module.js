"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerTemplatesModule = void 0;
const common_1 = require("@nestjs/common");
const customer_templates_service_1 = require("./customer-templates.service");
const customer_templates_controller_1 = require("./customer-templates.controller");
const mongoose_1 = require("@nestjs/mongoose");
const customer_template_schema_1 = require("./schemas/customer-template.schema");
const customer_template_repository_1 = require("./repositories/customer-template.repository");
const cms_module_1 = require("../../../cms/cms/cms.module");
let CustomerTemplatesModule = class CustomerTemplatesModule {
};
CustomerTemplatesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: customer_template_schema_1.CustomerTemplate.name, schema: customer_template_schema_1.CustomerTemplateSchema },
            ]),
            cms_module_1.CmsModule,
        ],
        controllers: [customer_templates_controller_1.CustomerTemplatesController],
        providers: [customer_templates_service_1.CustomerTemplatesService, customer_template_repository_1.CustomerTemplateRepository],
        exports: [customer_templates_service_1.CustomerTemplatesService],
    })
], CustomerTemplatesModule);
exports.CustomerTemplatesModule = CustomerTemplatesModule;
//# sourceMappingURL=customer-templates.module.js.map
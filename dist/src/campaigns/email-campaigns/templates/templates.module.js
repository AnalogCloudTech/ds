"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatesModule = void 0;
const common_1 = require("@nestjs/common");
const templates_controller_1 = require("./templates.controller");
const templates_service_1 = require("./templates.service");
const cms_module_1 = require("../../../cms/cms/cms.module");
const ses_module_1 = require("../../../internal/libs/aws/ses/ses.module");
const campaigns_module_1 = require("../campaigns/campaigns.module");
const customer_templates_module_1 = require("../customer-templates/customer-templates.module");
let TemplatesModule = class TemplatesModule {
};
TemplatesModule = __decorate([
    (0, common_1.Module)({
        imports: [cms_module_1.CmsModule, ses_module_1.SesModule, campaigns_module_1.CampaignsModule, customer_templates_module_1.CustomerTemplatesModule],
        controllers: [templates_controller_1.TemplatesController],
        providers: [templates_service_1.TemplatesService, common_1.Logger],
        exports: [templates_service_1.TemplatesService],
    })
], TemplatesModule);
exports.TemplatesModule = TemplatesModule;
//# sourceMappingURL=templates.module.js.map
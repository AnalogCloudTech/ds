"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignAttributesModule = void 0;
const common_1 = require("@nestjs/common");
const campaign_attributes_service_1 = require("./campaign-attributes.service");
const campaign_attributes_controller_1 = require("./campaign-attributes.controller");
const ses_module_1 = require("../../../internal/libs/aws/ses/ses.module");
let CampaignAttributesModule = class CampaignAttributesModule {
};
CampaignAttributesModule = __decorate([
    (0, common_1.Module)({
        imports: [ses_module_1.SesModule],
        controllers: [campaign_attributes_controller_1.CampaignAttributesController],
        providers: [campaign_attributes_service_1.CampaignAttributesService],
    })
], CampaignAttributesModule);
exports.CampaignAttributesModule = CampaignAttributesModule;
//# sourceMappingURL=campaign-attributes.module.js.map
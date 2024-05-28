"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsCampaignsModule = void 0;
const common_1 = require("@nestjs/common");
const sms_campaigns_service_1 = require("./sms-campaigns.service");
const sms_campaigns_controller_1 = require("./sms-campaigns.controller");
const sms_campaign_repository_1 = require("./repositories/sms-campaign.repository");
const mongoose_1 = require("@nestjs/mongoose");
const sms_campaign_schema_1 = require("./schemas/sms-campaign.schema");
const leads_module_1 = require("../../email-campaigns/leads/leads.module");
const sms_templates_module_1 = require("../sms-templates/sms-templates.module");
let SmsCampaignsModule = class SmsCampaignsModule {
};
SmsCampaignsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: sms_campaign_schema_1.SmsCampaign.name, schema: sms_campaign_schema_1.SmsCampaignSchema },
            ]),
            sms_templates_module_1.SmsTemplatesModule,
            leads_module_1.LeadsModule,
        ],
        controllers: [sms_campaigns_controller_1.SmsCampaignsController],
        providers: [sms_campaigns_service_1.SmsCampaignsService, sms_campaign_repository_1.SmsCampaignRepository],
        exports: [sms_campaigns_service_1.SmsCampaignsService],
    })
], SmsCampaignsModule);
exports.SmsCampaignsModule = SmsCampaignsModule;
//# sourceMappingURL=sms-campaigns.module.js.map
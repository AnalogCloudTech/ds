"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignsModule = void 0;
const common_1 = require("@nestjs/common");
const campaigns_service_1 = require("./services/campaigns.service");
const campaigns_controller_1 = require("./campaigns.controller");
const mongoose_1 = require("@nestjs/mongoose");
const campaign_schema_1 = require("./schemas/campaign.schema");
const exists_in_cms_1 = require("../../../cms/cms/validation-rules/exists-in-cms");
const campaign_listeners_1 = require("./listeners/campaign.listeners");
const ses_module_1 = require("../../../internal/libs/aws/ses/ses.module");
const leads_module_1 = require("../leads/leads.module");
const contents_module_1 = require("../contents/contents.module");
const cms_module_1 = require("../../../cms/cms/cms.module");
const segments_module_1 = require("../segments/segments.module");
const email_history_module_1 = require("../email-history/email-history.module");
const campaign_history_schema_1 = require("./schemas/campaign-history.schema");
const send_campaigns_service_1 = require("./services/send-campaigns.service");
const campaign_repository_1 = require("./repositories/campaign.repository");
const campaigns_scheduler_1 = require("./campaigns.scheduler");
const templates_module_1 = require("../templates/templates.module");
const analytics_module_1 = require("../../../legacy/dis/legacy/analytics/analytics.module");
const afy_notifications_module_1 = require("../../../integrations/afy-notifications/afy-notifications.module");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../constants");
const csv_uploader_queue_processor_1 = require("../processors/csv-uploader-queue.processor");
const s3_module_1 = require("../../../internal/libs/aws/s3/s3.module");
let CampaignsModule = class CampaignsModule {
};
CampaignsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: campaign_schema_1.Campaign.name, schema: campaign_schema_1.CampaignSchema },
                { name: campaign_history_schema_1.CampaignHistory.name, schema: campaign_history_schema_1.CampaignHistorySchema },
            ]),
            bull_1.BullModule.registerQueueAsync({
                name: constants_1.CSV_UPLOADER_QUEUE,
            }),
            contents_module_1.ContentsModule,
            ses_module_1.SesModule,
            leads_module_1.LeadsModule,
            cms_module_1.CmsModule,
            segments_module_1.SegmentsModule,
            (0, common_1.forwardRef)(() => email_history_module_1.EmailHistoryModule),
            (0, common_1.forwardRef)(() => templates_module_1.TemplatesModule),
            analytics_module_1.AnalyticsModule,
            afy_notifications_module_1.AfyNotificationsModule,
            s3_module_1.S3Module,
        ],
        controllers: [campaigns_controller_1.CampaignsController],
        providers: [
            common_1.Logger,
            campaigns_service_1.CampaignsService,
            send_campaigns_service_1.SendCampaignsService,
            exists_in_cms_1.ExistsInCmsRule,
            campaign_listeners_1.CampaignListeners,
            campaign_repository_1.CampaignRepository,
            campaigns_scheduler_1.CampaignsScheduler,
            csv_uploader_queue_processor_1.CsvUploaderQueueProcessor,
        ],
        exports: [campaigns_service_1.CampaignsService, send_campaigns_service_1.SendCampaignsService],
    })
], CampaignsModule);
exports.CampaignsModule = CampaignsModule;
//# sourceMappingURL=campaigns.module.js.map
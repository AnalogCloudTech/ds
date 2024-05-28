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
exports.SmsCampaignsScheduler = void 0;
const common_1 = require("@nestjs/common");
const sms_campaigns_service_1 = require("./sms-campaigns.service");
const schedule_1 = require("@nestjs/schedule");
const dateFormatters_1 = require("../../../internal/common/utils/dateFormatters");
const sms_templates_service_1 = require("../sms-templates/sms-templates.service");
const functions_1 = require("../../../internal/utils/functions");
let SmsCampaignsScheduler = class SmsCampaignsScheduler {
    constructor(service, smsTemplatesService) {
        this.service = service;
        this.smsTemplatesService = smsTemplatesService;
    }
    async handler() {
        const campaigns = await this.service.campaignsToBeSent();
        const templateIds = campaigns.map((campaign) => campaign.templateId);
        const smsTemplateQuery = {
            filters: {
                id: {
                    $in: templateIds,
                },
            },
        };
        const templatesResponse = await this.smsTemplatesService.findAllPaginated(smsTemplateQuery);
        const templates = templatesResponse.data;
        for (const campaign of campaigns) {
            const customer = campaign.customer;
            const template = templates.find((template) => template.id === campaign.templateId);
            if (!template) {
                continue;
            }
            await this.service.getLeads(campaign, customer);
            await this.service.setDone(campaign);
            await (0, functions_1.sleep)(1000);
        }
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_9AM, {
        timeZone: dateFormatters_1.TimeZones.EST,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SmsCampaignsScheduler.prototype, "handler", null);
SmsCampaignsScheduler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sms_campaigns_service_1.SmsCampaignsService,
        sms_templates_service_1.SmsTemplatesService])
], SmsCampaignsScheduler);
exports.SmsCampaignsScheduler = SmsCampaignsScheduler;
//# sourceMappingURL=sms-campaigns.scheduler.js.map
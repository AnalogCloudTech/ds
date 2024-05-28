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
exports.CampaignsScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const dateFormatters_1 = require("../../../internal/common/utils/dateFormatters");
const services_1 = require("./services");
const lodash_1 = require("lodash");
const types_1 = require("./domain/types");
const luxon_1 = require("luxon");
const contexts_1 = require("../../../internal/common/contexts");
let CampaignsScheduler = class CampaignsScheduler {
    constructor(service, logger) {
        this.service = service;
        this.logger = logger;
    }
    async handleCampaigns() {
        this.logger.log({
            payload: {
                usageDate: luxon_1.DateTime.now(),
                message: 'handleCampaigns@start',
            },
        }, contexts_1.CONTEXT_EMAIL_CAMPAIGNS_DEBUG);
        const campaigns = await this.service.getCampaignsToBeSent();
        this.logger.log({
            payload: {
                usageDate: luxon_1.DateTime.now(),
                message: `Found ${(0, lodash_1.get)(campaigns, 'length', 0)} campaigns to be sent`,
                campaigns: (0, lodash_1.map)(campaigns, (campaign) => campaign._id),
            },
        }, contexts_1.CONTEXT_EMAIL_CAMPAIGNS_DEBUG);
        await this.service.sendAllCampaignsByHandler(campaigns, types_1.CampaignHandler.ABSOLUTE);
        await this.service.sendAllCampaignsByHandler(campaigns, types_1.CampaignHandler.RELATIVE);
        this.logger.log({
            payload: {
                usageDate: luxon_1.DateTime.now(),
                message: 'handleCampaigns@end',
            },
        }, contexts_1.CONTEXT_EMAIL_CAMPAIGNS_DEBUG);
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_9AM, {
        timeZone: dateFormatters_1.TimeZones.EST,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CampaignsScheduler.prototype, "handleCampaigns", null);
CampaignsScheduler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [services_1.SendCampaignsService,
        common_1.Logger])
], CampaignsScheduler);
exports.CampaignsScheduler = CampaignsScheduler;
//# sourceMappingURL=campaigns.scheduler.js.map
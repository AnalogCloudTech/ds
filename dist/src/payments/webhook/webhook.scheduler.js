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
exports.WebhookScheduler = void 0;
const luxon_1 = require("luxon");
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const contexts_1 = require("../../internal/common/contexts");
const customer_properties_service_1 = require("../../customers/customer-properties/customer-properties.service");
const dateFormatters_1 = require("../../legacy/dis/legacy/common/utils/dateFormatters");
const hubspot_service_1 = require("../../legacy/dis/legacy/hubspot/hubspot.service");
const functions_1 = require("../../internal/utils/functions");
let WebhookScheduler = class WebhookScheduler {
    constructor(logger, customerPropertiesService, hubspotService) {
        this.logger = logger;
        this.customerPropertiesService = customerPropertiesService;
        this.hubspotService = hubspotService;
    }
    async handleMissingAssociation() {
        const failedAssociationsList = await this.customerPropertiesService.findAll({
            filter: {
                module: { $eq: 'onboard' },
                value: { $eq: 'association' },
                deletedAt: { $eq: null },
            },
        });
        if (!failedAssociationsList.length)
            return;
        for (const propertiesInfo of failedAssociationsList) {
            try {
                const customer = propertiesInfo.customer;
                const email = (customer === null || customer === void 0 ? void 0 : customer.email) || (propertiesInfo === null || propertiesInfo === void 0 ? void 0 : propertiesInfo.customerEmail);
                const hubspotContactId = await this.hubspotService.getContactId(email);
                const metadata = propertiesInfo.metadata;
                const { dealId } = metadata;
                if (hubspotContactId) {
                    this.logger.log({
                        payload: {
                            email,
                            method: 'handleMissingAssociation cronjob',
                            usageDate: luxon_1.DateTime.now(),
                            hubspotContactId,
                            message: 'contact id found. Creating deal association',
                        },
                    }, contexts_1.CONTEXT_CRONJOB_HANDLE_FAILED_EVENTS);
                    const association = await this.hubspotService.associateDealToContact(hubspotContactId, dealId);
                    if (association.id) {
                        await this.customerPropertiesService.softDelete(propertiesInfo._id);
                    }
                }
                metadata.reason = 'hubspotContact id not found';
                await (0, functions_1.sleep)(250);
            }
            catch (err) {
                if (err instanceof Error) {
                    this.logger.error({
                        payload: {
                            method: 'WebhookScheduler@handleMissingAssociation',
                            usageDate: luxon_1.DateTime.now(),
                            message: 'error while handling missing association',
                        },
                    }, err === null || err === void 0 ? void 0 : err.stack, contexts_1.CONTEXT_CRONJOB_HANDLE_FAILED_EVENTS);
                }
            }
        }
        this.logger.log({
            payload: {
                method: 'handleMissingAssociation cronjob',
                usageDate: luxon_1.DateTime.now(),
                message: 'Cronjob result',
            },
        }, contexts_1.CONTEXT_CRONJOB_HANDLE_FAILED_EVENTS);
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_MINUTES, {
        name: 'webhook',
        timeZone: dateFormatters_1.TimeZones.EST,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebhookScheduler.prototype, "handleMissingAssociation", null);
WebhookScheduler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [common_1.Logger,
        customer_properties_service_1.CustomerPropertiesService,
        hubspot_service_1.HubspotService])
], WebhookScheduler);
exports.WebhookScheduler = WebhookScheduler;
//# sourceMappingURL=webhook.scheduler.js.map
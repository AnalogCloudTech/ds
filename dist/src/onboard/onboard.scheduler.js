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
exports.OnboardScheduler = void 0;
const common_1 = require("@nestjs/common");
const onboard_service_1 = require("./onboard.service");
const payments_service_1 = require("../payments/payment_chargify/payments.service");
const session_service_1 = require("./services/session.service");
const luxon_1 = require("luxon");
const functions_1 = require("../internal/utils/functions");
const hubspot_service_1 = require("../legacy/dis/legacy/hubspot/hubspot.service");
const schedule_1 = require("@nestjs/schedule");
const dateFormatters_1 = require("../internal/common/utils/dateFormatters");
const contexts_1 = require("../internal/common/contexts");
let OnboardScheduler = class OnboardScheduler {
    constructor(onboardService, sessionService, paymentChargifyService, hubspotService, logger) {
        this.onboardService = onboardService;
        this.sessionService = sessionService;
        this.paymentChargifyService = paymentChargifyService;
        this.hubspotService = hubspotService;
        this.logger = logger;
    }
    async syncCustomerLastStepHubspot() {
        var _a;
        const startOfDay = luxon_1.DateTime.now().startOf('day');
        const endOfDay = luxon_1.DateTime.now().endOf('day');
        const filter = {
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
            customer: { $exists: true },
        };
        const sessions = await this.sessionService.getSessionsToUpdateCustomerLastStepHubspot(filter);
        if (sessions.length) {
            for (const session of sessions) {
                const hubspotId = (_a = session.customer) === null || _a === void 0 ? void 0 : _a.hubspotId;
                const { currentStep: onboarding_last_step } = session;
                if (hubspotId) {
                    const update = {
                        properties: {
                            onboarding_last_step,
                        },
                    };
                    try {
                        await this.hubspotService.updateContactById(hubspotId, update);
                    }
                    catch (error) {
                        if (error instanceof Error) {
                            const payload = {
                                usageDate: luxon_1.DateTime.now(),
                                error: error === null || error === void 0 ? void 0 : error.message,
                                stack: error === null || error === void 0 ? void 0 : error.stack,
                                message: `Unable to update hubspot contact last step - ${hubspotId}`,
                            };
                            this.logger.error({ payload }, '', contexts_1.CONTEXT_ONBOARD_CRON_LAST_STEP_ERROR);
                        }
                    }
                }
                await (0, functions_1.sleep)(5000);
            }
        }
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_10PM, {
        timeZone: dateFormatters_1.TimeZones.EST,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OnboardScheduler.prototype, "syncCustomerLastStepHubspot", null);
OnboardScheduler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [onboard_service_1.OnboardService,
        session_service_1.SessionService,
        payments_service_1.PaymentChargifyService,
        hubspot_service_1.HubspotService,
        common_1.Logger])
], OnboardScheduler);
exports.OnboardScheduler = OnboardScheduler;
//# sourceMappingURL=onboard.scheduler.js.map
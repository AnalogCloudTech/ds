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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerMilestoneScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const luxon_1 = require("luxon");
const dateFormatters_1 = require("../../internal/common/utils/dateFormatters");
const contexts_1 = require("../../internal/common/contexts");
const customer_milestone_service_1 = require("./customer-milestone.service");
let CustomerMilestoneScheduler = class CustomerMilestoneScheduler {
    constructor(customersMilestoneService, logger) {
        this.customersMilestoneService = customersMilestoneService;
        this.logger = logger;
    }
    async customerMilestone() {
        this.logger.log({
            payload: {
                message: 'Starting the customer milestone',
                usageDate: luxon_1.DateTime.now(),
            },
        }, contexts_1.CONTEXT_CUSTOMER_MILESTONE);
        await this.customersMilestoneService.customerMilestone();
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_11PM, {
        timeZone: dateFormatters_1.TimeZones.EST,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerMilestoneScheduler.prototype, "customerMilestone", null);
CustomerMilestoneScheduler = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('logger')),
    __metadata("design:paramtypes", [customer_milestone_service_1.CustomerMilestoneService,
        common_1.Logger])
], CustomerMilestoneScheduler);
exports.CustomerMilestoneScheduler = CustomerMilestoneScheduler;
//# sourceMappingURL=customer-milestone.scheduler.js.map
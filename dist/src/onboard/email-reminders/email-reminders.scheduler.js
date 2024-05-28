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
exports.EmailRemindersScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const dateFormatters_1 = require("../../internal/common/utils/dateFormatters");
const email_reminders_service_1 = require("./email-reminders.service");
const types_1 = require("./domain/types");
const luxon_1 = require("luxon");
const ses_service_1 = require("../../internal/libs/aws/ses/ses.service");
const contexts_1 = require("../../internal/common/contexts");
const twilio_service_1 = require("../../campaigns/twillio/twilio.service");
const customers_service_1 = require("../../customers/customers/customers.service");
const sms_templates_service_1 = require("../../campaigns/sms/sms-templates/sms-templates.service");
let EmailRemindersScheduler = class EmailRemindersScheduler {
    constructor(service, sesService, twilioService, customersService, smsTemplateService, logger) {
        this.service = service;
        this.sesService = sesService;
        this.twilioService = twilioService;
        this.customersService = customersService;
        this.smsTemplateService = smsTemplateService;
        this.logger = logger;
    }
    async handleCron() {
        const filters = {
            status: types_1.Status.SCHEDULED,
            date: { $lt: luxon_1.DateTime.now() },
        };
        const reminders = await this.service.findAll(filters);
        for (const reminder of reminders) {
            if (!reminder.customer) {
                this.logger.error({
                    payload: {
                        usageDate: luxon_1.DateTime.now(),
                        reminderId: reminder._id.toString(),
                        error: 'missing customer in reminder',
                        subcontext: contexts_1.CONTEXT_SCHEDULER_MANAGER,
                    },
                }, '', contexts_1.CONTEXT_ERROR);
                await this.service.update(reminder._id, {
                    status: types_1.Status.ERROR,
                });
                continue;
            }
            try {
                const params = await this.sesService.buildEmailReminderParams(reminder);
                const sendResponse = await this.sesService.sendSingleEmail(params);
                await this.service.update(reminder._id, {
                    status: types_1.Status.SENT,
                    messageId: sendResponse.MessageId,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    await this.service.update(reminder._id, {
                        status: types_1.Status.ERROR,
                    });
                    this.logger.error({
                        payload: {
                            usageDate: luxon_1.DateTime.now(),
                            reminderId: reminder._id.toString(),
                            error,
                            subcontext: contexts_1.CONTEXT_SCHEDULER_MANAGER,
                        },
                    }, '', contexts_1.CONTEXT_ERROR);
                }
            }
        }
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_SECONDS, {
        timeZone: dateFormatters_1.TimeZones.EST,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmailRemindersScheduler.prototype, "handleCron", null);
EmailRemindersScheduler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_reminders_service_1.EmailRemindersService,
        ses_service_1.SesService,
        twilio_service_1.TwilioService,
        customers_service_1.CustomersService,
        sms_templates_service_1.SmsTemplatesService,
        common_1.Logger])
], EmailRemindersScheduler);
exports.EmailRemindersScheduler = EmailRemindersScheduler;
//# sourceMappingURL=email-reminders.scheduler.js.map
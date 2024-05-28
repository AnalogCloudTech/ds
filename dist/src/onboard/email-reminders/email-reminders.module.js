"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailRemindersModule = void 0;
const common_1 = require("@nestjs/common");
const email_reminders_service_1 = require("./email-reminders.service");
const email_reminders_controller_1 = require("./email-reminders.controller");
const email_reminders_repository_1 = require("./repositories/email-reminders.repository");
const mongoose_1 = require("@nestjs/mongoose");
const email_reminder_schema_1 = require("./schemas/email-reminder.schema");
const coaches_module_1 = require("../coaches/coaches.module");
const ses_module_1 = require("../../internal/libs/aws/ses/ses.module");
const hubspot_module_1 = require("../../legacy/dis/legacy/hubspot/hubspot.module");
const email_reminders_scheduler_1 = require("./email-reminders.scheduler");
const twilio_module_1 = require("../../campaigns/twillio/twilio.module");
const sms_templates_module_1 = require("../../campaigns/sms/sms-templates/sms-templates.module");
const dentist_coaches_module_1 = require("../dentist-coaches/dentist-coaches.module");
let EmailRemindersModule = class EmailRemindersModule {
};
EmailRemindersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => coaches_module_1.CoachesModule),
            (0, common_1.forwardRef)(() => dentist_coaches_module_1.DentistCoachesModule),
            ses_module_1.SesModule,
            twilio_module_1.TwilioModule,
            hubspot_module_1.HubspotModule,
            sms_templates_module_1.SmsTemplatesModule,
            mongoose_1.MongooseModule.forFeature([
                { name: email_reminder_schema_1.EmailReminder.name, schema: email_reminder_schema_1.EmailReminderSchema },
            ]),
        ],
        controllers: [email_reminders_controller_1.EmailRemindersController],
        providers: [
            email_reminders_service_1.EmailRemindersService,
            email_reminders_repository_1.EmailRemindersRepository,
            common_1.Logger,
            email_reminders_scheduler_1.EmailRemindersScheduler,
        ],
        exports: [email_reminders_service_1.EmailRemindersService],
    })
], EmailRemindersModule);
exports.EmailRemindersModule = EmailRemindersModule;
//# sourceMappingURL=email-reminders.module.js.map
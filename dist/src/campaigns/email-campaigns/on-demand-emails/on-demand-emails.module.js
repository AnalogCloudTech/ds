"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnDemandEmailsModule = void 0;
const common_1 = require("@nestjs/common");
const on_demand_emails_service_1 = require("./on-demand-emails.service");
const on_demand_emails_controller_1 = require("./on-demand-emails.controller");
const mongoose_1 = require("@nestjs/mongoose");
const on_demand_email_schema_1 = require("./schemas/on-demand-email.schema");
const ses_service_1 = require("../../../internal/libs/aws/ses/ses.service");
const ses_module_1 = require("../../../internal/libs/aws/ses/ses.module");
const dis_module_1 = require("../../../legacy/dis/dis.module");
const leads_module_1 = require("../leads/leads.module");
const templates_module_1 = require("../templates/templates.module");
const email_history_module_1 = require("../email-history/email-history.module");
const segments_module_1 = require("../segments/segments.module");
const on_demand_emails_scheduler_1 = require("./on-demand-emails.scheduler");
const afy_notifications_module_1 = require("../../../integrations/afy-notifications/afy-notifications.module");
let OnDemandEmailsModule = class OnDemandEmailsModule {
};
OnDemandEmailsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: on_demand_email_schema_1.OnDemandEmail.name, schema: on_demand_email_schema_1.OnDemandEmailSchema },
            ]),
            ses_module_1.SesModule,
            dis_module_1.DisModule,
            leads_module_1.LeadsModule,
            (0, common_1.forwardRef)(() => templates_module_1.TemplatesModule),
            (0, common_1.forwardRef)(() => email_history_module_1.EmailHistoryModule),
            segments_module_1.SegmentsModule,
            afy_notifications_module_1.AfyNotificationsModule,
        ],
        controllers: [on_demand_emails_controller_1.OnDemandEmailsController],
        providers: [
            common_1.Logger,
            on_demand_emails_service_1.OnDemandEmailsService,
            on_demand_emails_scheduler_1.OnDemandEmailsScheduler,
            ses_service_1.SesService,
        ],
        exports: [on_demand_emails_service_1.OnDemandEmailsService],
    })
], OnDemandEmailsModule);
exports.OnDemandEmailsModule = OnDemandEmailsModule;
//# sourceMappingURL=on-demand-emails.module.js.map
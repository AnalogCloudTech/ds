"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailHistoryModule = void 0;
const common_1 = require("@nestjs/common");
const email_history_service_1 = require("./email-history.service");
const email_history_controller_1 = require("./email-history.controller");
const mongoose_1 = require("@nestjs/mongoose");
const email_history_schema_1 = require("./schemas/email-history.schema");
const on_demand_emails_module_1 = require("../on-demand-emails/on-demand-emails.module");
const campaigns_module_1 = require("../campaigns/campaigns.module");
const leads_module_1 = require("../leads/leads.module");
const logger_1 = require("../../../internal/utils/logger");
const contexts_1 = require("../../../internal/common/contexts");
const email_history_repository_1 = require("./email-history.repository");
let EmailHistoryModule = class EmailHistoryModule {
};
EmailHistoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: email_history_schema_1.EmailHistory.name, schema: email_history_schema_1.EmailHistorySchema },
            ]),
            leads_module_1.LeadsModule,
            (0, common_1.forwardRef)(() => campaigns_module_1.CampaignsModule),
            (0, common_1.forwardRef)(() => on_demand_emails_module_1.OnDemandEmailsModule),
        ],
        controllers: [email_history_controller_1.EmailHistoryController],
        providers: [
            email_history_service_1.EmailHistoryService,
            email_history_repository_1.EmailHistoryRepository,
            (0, logger_1.LoggerWithContext)(contexts_1.CONTEXT_EMAIL_HISTORY),
        ],
        exports: [email_history_service_1.EmailHistoryService],
    })
], EmailHistoryModule);
exports.EmailHistoryModule = EmailHistoryModule;
//# sourceMappingURL=email-history.module.js.map
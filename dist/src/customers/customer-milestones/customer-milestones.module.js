"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerMilestoneModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const leads_module_1 = require("../../campaigns/email-campaigns/leads/leads.module");
const hubspot_module_1 = require("../../legacy/dis/legacy/hubspot/hubspot.module");
const logger_1 = require("../../internal/utils/logger");
const contexts_1 = require("../../internal/common/contexts");
const customer_milestone_service_1 = require("./customer-milestone.service");
const customer_milestone_controller_1 = require("./customer-milestone.controller");
const customer_milestone_scheduler_1 = require("./customer-milestone.scheduler");
const customers_milestone_repository_1 = require("./repository/customers-milestone-repository");
const customer_milestone_schema_1 = require("./schema/customer-milestone.schema");
let CustomerMilestoneModule = class CustomerMilestoneModule {
};
CustomerMilestoneModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: customer_milestone_schema_1.CustomerMilestone.name, schema: customer_milestone_schema_1.CustomerMilestoneSchema },
            ]),
            hubspot_module_1.HubspotModule,
            leads_module_1.LeadsModule,
        ],
        controllers: [customer_milestone_controller_1.CustomerMilestoneController],
        providers: [
            customer_milestone_service_1.CustomerMilestoneService,
            customers_milestone_repository_1.CustomersMilestoneRepository,
            customer_milestone_scheduler_1.CustomerMilestoneScheduler,
            common_1.Logger,
            (0, logger_1.LoggerWithContext)(contexts_1.ADMIN_CUSTOMER_MILESTONE),
        ],
        exports: [customer_milestone_service_1.CustomerMilestoneService],
    })
], CustomerMilestoneModule);
exports.CustomerMilestoneModule = CustomerMilestoneModule;
//# sourceMappingURL=customer-milestones.module.js.map
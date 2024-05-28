"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagazinesModule = void 0;
const common_1 = require("@nestjs/common");
const magazines_service_1 = require("./services/magazines.service");
const magazines_controller_1 = require("./controllers/magazines.controller");
const magazine_schema_1 = require("./schemas/magazine.schema");
const mongoose_1 = require("@nestjs/mongoose");
const cms_module_1 = require("../../cms/cms/cms.module");
const magazines_repository_1 = require("./repositories/magazines.repository");
const generated_magazines_controller_1 = require("./controllers/generated-magazines.controller");
const generated_magazines_repository_1 = require("./repositories/generated-magazines.repository");
const generated_magazines_service_1 = require("./services/generated-magazines.service");
const generated_magazine_schema_1 = require("./schemas/generated-magazine.schema");
const sns_module_1 = require("../../internal/libs/aws/sns/sns.module");
const logger_1 = require("../../internal/utils/logger");
const contexts_1 = require("../../internal/common/contexts");
const hubspot_module_1 = require("../../legacy/dis/legacy/hubspot/hubspot.module");
const referral_marketing_admins_controller_1 = require("./controllers/referral-marketing-admins.controller");
const referral_marketing_admins_service_1 = require("./services/referral-marketing-admins.service");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("./constants");
const admin_monthly_magazine_processor_1 = require("./processors/admin-monthly-magazine.processor");
const flippingbook_module_1 = require("../../integrations/flippingbook/flippingbook.module");
const admin_permanent_link_queue_processor_1 = require("./processors/admin-permanent-link-queue.processor");
let MagazinesModule = class MagazinesModule {
};
MagazinesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: magazine_schema_1.Magazine.name, schema: magazine_schema_1.MagazineSchema },
                { name: generated_magazine_schema_1.GeneratedMagazine.name, schema: generated_magazine_schema_1.GeneratedMagazineSchema },
            ]),
            bull_1.BullModule.registerQueueAsync({
                name: constants_1.MONTHLY_TURN_OVER_MAGAZINE_QUEUE,
            }),
            bull_1.BullModule.registerQueueAsync({
                name: constants_1.PERMANENT_LINKS_TURN_OVER,
            }),
            cms_module_1.CmsModule,
            sns_module_1.SnsModule,
            hubspot_module_1.HubspotModule,
            flippingbook_module_1.FlippingBookModule,
        ],
        controllers: [
            generated_magazines_controller_1.GeneratedMagazinesController,
            magazines_controller_1.MagazinesController,
            referral_marketing_admins_controller_1.ReferralMarketingAdminsController,
        ],
        providers: [
            common_1.Logger,
            magazines_repository_1.MagazinesRepository,
            magazines_service_1.MagazinesService,
            generated_magazines_repository_1.GeneratedMagazinesRepository,
            generated_magazines_service_1.GeneratedMagazinesService,
            referral_marketing_admins_service_1.ReferralMarketingAdminsService,
            admin_monthly_magazine_processor_1.AdminMonthlyMagazineProcessor,
            admin_permanent_link_queue_processor_1.AdminPermanentLinkQueueProcessor,
            (0, logger_1.LoggerWithContext)(contexts_1.CONTEXT_REFERRAL_MARKETING_MAGAZINE),
        ],
        exports: [magazines_service_1.MagazinesService, generated_magazines_service_1.GeneratedMagazinesService],
    })
], MagazinesModule);
exports.MagazinesModule = MagazinesModule;
//# sourceMappingURL=magazines.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpsellModule = void 0;
const common_1 = require("@nestjs/common");
const upsell_repository_1 = require("./upsell.repository");
const upsell_service_1 = require("./upsell.service");
const upsell_report_queue_processor_1 = require("./processors/upsell-report-queue.processor");
const upsell_controller_1 = require("./upsell.controller");
const mongoose_1 = require("@nestjs/mongoose");
const tw_upsell_schema_1 = require("./schemas/tw-upsell.schema");
const bull_1 = require("@nestjs/bull");
const constant_1 = require("./constant");
const hubspot_module_1 = require("../../legacy/dis/legacy/hubspot/hubspot.module");
const s3_module_1 = require("../../internal/libs/aws/s3/s3.module");
const ses_module_1 = require("../../internal/libs/aws/ses/ses.module");
const onboard_module_1 = require("../onboard.module");
let UpsellModule = class UpsellModule {
};
UpsellModule = __decorate([
    (0, common_1.Module)({
        imports: [
            onboard_module_1.OnboardModule,
            bull_1.BullModule.registerQueueAsync({
                name: constant_1.UPSELL_REPORT_QUEUE,
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: tw_upsell_schema_1.TripWireUpsell.name, schema: tw_upsell_schema_1.TripWireUpsellSchema },
            ]),
            hubspot_module_1.HubspotModule,
            s3_module_1.S3Module,
            ses_module_1.SesModule,
        ],
        controllers: [upsell_controller_1.UpsellController],
        providers: [
            upsell_repository_1.TwUpsellRepository,
            upsell_service_1.UpsellService,
            upsell_report_queue_processor_1.UpsellReportQueueProcessor,
            common_1.Logger,
        ],
    })
], UpsellModule);
exports.UpsellModule = UpsellModule;
//# sourceMappingURL=upsell.module.js.map
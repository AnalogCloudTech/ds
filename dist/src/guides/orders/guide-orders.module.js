"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuideOrdersModule = void 0;
const common_1 = require("@nestjs/common");
const guide_orders_service_1 = require("./guide-orders.service");
const guide_orders_controller_1 = require("./guide-orders.controller");
const mongoose_1 = require("@nestjs/mongoose");
const guide_orders_schema_1 = require("./schemas/guide-orders.schema");
const guide_orders_repository_1 = require("./repositories/guide-orders.repository");
const hubspot_module_1 = require("../../legacy/dis/legacy/hubspot/hubspot.module");
const onboard_module_1 = require("../../onboard/onboard.module");
const guide_catalog_module_1 = require("../catalog/guide-catalog.module");
let GuideOrdersModule = class GuideOrdersModule {
};
GuideOrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            onboard_module_1.OnboardModule,
            hubspot_module_1.HubspotModule,
            guide_catalog_module_1.GuideCatalogModule,
            mongoose_1.MongooseModule.forFeature([
                { name: guide_orders_schema_1.GuideOrders.name, schema: guide_orders_schema_1.GuideOrdersSchema },
            ]),
        ],
        providers: [guide_orders_service_1.GuideOrdersService, guide_orders_repository_1.GuideOrdersRepository],
        controllers: [guide_orders_controller_1.GuideOrdersController],
        exports: [guide_orders_service_1.GuideOrdersService, guide_orders_repository_1.GuideOrdersRepository],
    })
], GuideOrdersModule);
exports.GuideOrdersModule = GuideOrdersModule;
//# sourceMappingURL=guide-orders.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingPixelModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const hubspot_module_1 = require("../../legacy/dis/legacy/hubspot/hubspot.module");
const tracking_pixel_controller_1 = require("./tracking-pixel.controller");
const tracking_pixel_schema_1 = require("./schemas/tracking-pixel.schema");
const tracking_pixel_service_1 = require("./tracking-pixel.service");
const tracking_pixel_repository_1 = require("./repositories/tracking-pixel.repository");
let TrackingPixelModule = class TrackingPixelModule {
};
TrackingPixelModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: tracking_pixel_schema_1.TrackingPixel.name, schema: tracking_pixel_schema_1.TrackingPixelSchema },
            ]),
            hubspot_module_1.HubspotModule,
        ],
        providers: [
            common_1.Logger,
            config_1.ConfigService,
            tracking_pixel_service_1.TrackingPixelService,
            tracking_pixel_repository_1.TrackingPixelRepository,
        ],
        controllers: [tracking_pixel_controller_1.TrackingPixelController],
        exports: [mongoose_1.MongooseModule, tracking_pixel_service_1.TrackingPixelService],
    })
], TrackingPixelModule);
exports.TrackingPixelModule = TrackingPixelModule;
//# sourceMappingURL=tracking-pixel.module.js.map
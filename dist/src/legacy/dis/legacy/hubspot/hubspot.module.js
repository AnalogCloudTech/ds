"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubspotModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const hubspot_service_1 = require("./hubspot.service");
const hubspot_controller_1 = require("./hubspot.controller");
const api_client_1 = require("@hubspot/api-client");
const customer_events_module_1 = require("../../../../customers/customer-events/customer-events.module");
const mongoose_1 = require("@nestjs/mongoose");
const hubspot_sync_actions_schema_1 = require("./schemas/hubspot-sync-actions.schema");
const hubspot_sync_actions_repository_1 = require("./repository/hubspot-sync-actions.repository");
const hubspot_sync_actions_services_1 = require("./hubspot-sync-actions.services");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("./constants");
const hubspot_sync_actions_processor_1 = require("./processors/hubspot-sync-actions.processor");
const axios_2 = require("axios");
const axios_defaults_config_1 = require("../../../../internal/utils/axiosTranformer/axios-defaults-config");
let HubspotModule = class HubspotModule {
};
HubspotModule = __decorate([
    (0, common_1.Module)({
        controllers: [hubspot_controller_1.HubspotController],
        imports: [
            customer_events_module_1.CustomerEventsModule,
            mongoose_1.MongooseModule.forFeature([
                { name: hubspot_sync_actions_schema_1.HubspotSyncActions.name, schema: hubspot_sync_actions_schema_1.HubspotSyncActionsSchema },
            ]),
            axios_1.HttpModule.registerAsync({
                imports: [],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const baseURL = configService.get('hubspot.url');
                    return {
                        baseURL,
                    };
                },
            }),
            bull_1.BullModule.registerQueueAsync({
                name: constants_1.HUBSPOT_SYNC_ACTIONS_QUEUE,
            }),
        ],
        providers: [
            {
                inject: [config_1.ConfigService],
                provide: api_client_1.Client,
                useFactory: (configService) => {
                    const accessToken = configService.get('hubspot.key');
                    const numberOfApiCallRetries = configService.get('hubspot.retries');
                    return new api_client_1.Client({
                        accessToken,
                        numberOfApiCallRetries,
                    });
                },
            },
            {
                provide: 'HTTP_HS_FORMS',
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const baseURL = configService.get('hubspot.formsBaseUrl');
                    const config = Object.assign(Object.assign({}, (0, axios_defaults_config_1.axiosDefaultsConfig)()), { baseURL });
                    return new axios_2.Axios(config);
                },
            },
            {
                inject: [config_1.ConfigService],
                provide: 'APP_ENVIRONMENT',
                useFactory: (configService) => configService.get('app.env'),
            },
            hubspot_service_1.HubspotService,
            hubspot_sync_actions_repository_1.HubspotSyncActionsRepository,
            hubspot_sync_actions_services_1.HubspotSyncActionsServices,
            hubspot_sync_actions_processor_1.HubspotSyncActionsProcessor,
            common_1.Logger,
        ],
        exports: [
            hubspot_service_1.HubspotService,
            hubspot_sync_actions_services_1.HubspotSyncActionsServices,
            hubspot_sync_actions_processor_1.HubspotSyncActionsProcessor,
        ],
    })
], HubspotModule);
exports.HubspotModule = HubspotModule;
//# sourceMappingURL=hubspot.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const zoom_service_1 = require("./zoom.service");
const zoom_controller_1 = require("./zoom.controller");
const config_1 = require("@nestjs/config");
const hubspot_module_1 = require("../hubspot/hubspot.module");
const axios_1 = require("@nestjs/axios");
const api_client_1 = require("@hubspot/api-client");
const zoom_repository_1 = require("./zoom.repository");
const zoom_schema_1 = require("./schemas/zoom.schema");
const customers_module_1 = require("../../../../customers/customers/customers.module");
const s3_module_1 = require("../../../../internal/libs/aws/s3/s3.module");
const zoom_s3_schedulers_1 = require("./zoom-s3.schedulers");
const zoom_member_schema_1 = require("./schemas/zoom-member.schema");
const zoom_phone_user_schema_1 = require("./schemas/zoom-phone-user.schema");
const zoom_member_repository_1 = require("./zoom-member.repository");
const axios_2 = require("axios");
const constants_1 = require("./constants");
const zoom_phone_user_repository_1 = require("./zoom-phone-user.repository");
const axios_defaults_config_1 = require("../../../../internal/utils/axiosTranformer/axios-defaults-config");
let ZoomModule = class ZoomModule {
};
ZoomModule = __decorate([
    (0, common_1.Module)({
        imports: [
            hubspot_module_1.HubspotModule,
            mongoose_1.MongooseModule.forFeature([
                { name: zoom_schema_1.ZoomRecording.name, schema: zoom_schema_1.ZoomRecordingSchema },
                { name: zoom_member_schema_1.ZoomMember.name, schema: zoom_member_schema_1.ZoomMemberSchema },
                { name: zoom_phone_user_schema_1.ZoomPhoneUser.name, schema: zoom_phone_user_schema_1.ZoomPhoneUserSchema },
            ]),
            customers_module_1.CustomersModule,
            s3_module_1.S3Module,
            axios_1.HttpModule.registerAsync({
                imports: [],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const baseURL = configService.get('zoom.url');
                    return {
                        baseURL,
                        headers: {
                            Authorization: `Bearer ${configService.get('zoom.key')}`,
                        },
                    };
                },
            }),
        ],
        providers: [
            zoom_service_1.ZoomService,
            zoom_repository_1.ZoomDsRepository,
            zoom_member_repository_1.ZoomMemberRepository,
            zoom_phone_user_repository_1.ZoomPhoneUserRepository,
            common_1.Logger,
            {
                inject: [config_1.ConfigService],
                provide: api_client_1.Client,
                useFactory: (configService) => {
                    const accessToken = configService.get('hubspot.key');
                    return new api_client_1.Client({
                        accessToken,
                    });
                },
            },
            {
                provide: 'INTEGRATION_SERVICES_URL',
                useFactory: (configService) => configService.get('dis.url'),
                inject: [config_1.ConfigService],
            },
            {
                provide: constants_1.ZOOMAPI_PROVIDER_NAME,
                useFactory: (configService) => {
                    const baseURL = configService.get('zoom.zoomUrl');
                    const config = Object.assign(Object.assign({}, (0, axios_defaults_config_1.axiosDefaultsConfig)()), { baseURL });
                    return new axios_2.Axios(config);
                },
                inject: [config_1.ConfigService],
            },
            {
                inject: [config_1.ConfigService],
                provide: constants_1.ZOOM_API_KEY,
                useFactory: (configService) => {
                    return configService.get('zoom.zoomApiKey');
                },
            },
            {
                inject: [config_1.ConfigService],
                provide: constants_1.ZOOM_SECRET_KEY,
                useFactory: (configService) => {
                    return configService.get('zoom.zoomApiSecret');
                },
            },
            {
                provide: constants_1.ZOOM_VIDEO_SCHEDULER,
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    if (configService.get('zoom.cronjobEnv') === 'production') {
                        return zoom_s3_schedulers_1.ZoomS3Scheduler;
                    }
                },
            },
            {
                provide: 'ZOOM_JWT_TOKEN',
                useFactory: (configService) => configService.get('zoom.key'),
                inject: [config_1.ConfigService],
            },
            {
                provide: 'ZOOM_SERVER_O_URL',
                useFactory: (configService) => configService.get('zoom.zoomServerOAuthUrl'),
                inject: [config_1.ConfigService],
            },
            {
                provide: 'ZOOM_BASIC_TOKEN',
                useFactory: (configService) => configService.get('zoom.zoomBasicToken'),
                inject: [config_1.ConfigService],
            },
            {
                provide: 'ZOOM_SECRET_TOKEN',
                useFactory: (configService) => configService.get('zoom.zoomSecretToken'),
                inject: [config_1.ConfigService],
            },
            {
                provide: 'APP_ENVIRONMENT',
                useFactory: (configService) => configService.get('app.env'),
                inject: [config_1.ConfigService],
            },
            {
                provide: 'REVERSE_PROXY_URL',
                useFactory: (configService) => configService.get('zoom.proxy'),
                inject: [config_1.ConfigService],
            },
        ],
        controllers: [zoom_controller_1.ZoomController],
        exports: [zoom_service_1.ZoomService],
    })
], ZoomModule);
exports.ZoomModule = ZoomModule;
//# sourceMappingURL=zoom.module.js.map
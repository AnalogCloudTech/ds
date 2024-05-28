"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaingsModule = void 0;
const common_1 = require("@nestjs/common");
const campaings_service_1 = require("./campaings.service");
const campaings_controller_1 = require("./campaings.controller");
const mongoose_1 = require("@nestjs/mongoose");
const campaigns_schema_1 = require("./schemas/campaigns.schema");
const config_1 = require("@nestjs/config");
const campaigns_scheduler_1 = require("./campaigns.scheduler");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("./constants");
const attributes_schemas_1 = require("../attributes/schemas/attributes.schemas");
const cms_module_1 = require("../../../cms/cms/cms.module");
const common_helpers_1 = require("./helpers/common.helpers");
const axios_1 = require("axios");
const axios_defaults_config_1 = require("../../../internal/utils/axiosTranformer/axios-defaults-config");
let CampaingsModule = class CampaingsModule {
};
CampaingsModule = __decorate([
    (0, common_1.Module)({
        exports: [campaings_service_1.CampaingsService],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: campaigns_schema_1.Campaigns.name, schema: campaigns_schema_1.CampaignsSchema },
                { name: attributes_schemas_1.Attribute.name, schema: attributes_schemas_1.AttributeSchema },
            ]),
            bull_1.BullModule.registerQueueAsync({
                name: constants_1.SEND_SM_CAMPAIGN_QUEUE_PROCESSOR,
            }),
            cms_module_1.CmsModule,
        ],
        controllers: [campaings_controller_1.CampaingsController],
        providers: [
            campaings_service_1.CampaingsService,
            campaigns_scheduler_1.SMCampaignsScheduler,
            common_helpers_1.CommonHelpers,
            {
                provide: 'HTTP_FACEBOOK',
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const baseURL = configService.get('facebookToken.host');
                    const config = Object.assign(Object.assign({}, (0, axios_defaults_config_1.axiosDefaultsConfig)()), { baseURL });
                    return new axios_1.Axios(config);
                },
            },
        ],
    })
], CampaingsModule);
exports.CampaingsModule = CampaingsModule;
//# sourceMappingURL=campaings.module.js.map
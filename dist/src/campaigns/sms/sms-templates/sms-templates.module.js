"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsTemplatesModule = void 0;
const common_1 = require("@nestjs/common");
const sms_templates_service_1 = require("./sms-templates.service");
const sms_templates_controller_1 = require("./sms-templates.controller");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const axios_defaults_config_1 = require("../../../internal/utils/axiosTranformer/axios-defaults-config");
let SmsTemplatesModule = class SmsTemplatesModule {
};
SmsTemplatesModule = __decorate([
    (0, common_1.Module)({
        controllers: [sms_templates_controller_1.SmsTemplatesController],
        providers: [
            sms_templates_service_1.SmsTemplatesService,
            {
                provide: 'HTTP_CMS',
                useFactory: (configService) => {
                    const baseURL = configService.get('cms.url');
                    const key = configService.get('cms.key');
                    const config = Object.assign(Object.assign({}, (0, axios_defaults_config_1.axiosDefaultsConfig)({
                        authorization: `Bearer ${key}`,
                    })), { baseURL });
                    return new axios_1.Axios(config);
                },
                inject: [config_1.ConfigService],
            },
        ],
        exports: [sms_templates_service_1.SmsTemplatesService],
    })
], SmsTemplatesModule);
exports.SmsTemplatesModule = SmsTemplatesModule;
//# sourceMappingURL=sms-templates.module.js.map
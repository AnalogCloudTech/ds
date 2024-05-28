"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cms_controller_1 = require("./cms.controller");
const cms_service_1 = require("./cms.service");
const axios_1 = require("axios");
const axios_defaults_config_1 = require("../../internal/utils/axiosTranformer/axios-defaults-config");
let CmsModule = class CmsModule {
};
CmsModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [cms_controller_1.CmsController],
        providers: [
            cms_service_1.CmsService,
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
        exports: [cms_service_1.CmsService],
    })
], CmsModule);
exports.CmsModule = CmsModule;
//# sourceMappingURL=cms.module.js.map
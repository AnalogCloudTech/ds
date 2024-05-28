"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebinarsModule = void 0;
const common_1 = require("@nestjs/common");
const webinars_service_1 = require("./webinars.service");
const webinars_controller_1 = require("./webinars.controller");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
let WebinarsModule = class WebinarsModule {
};
WebinarsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.registerAsync({
                imports: [],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const baseURL = configService.get('webinar.url');
                    return {
                        baseURL,
                    };
                },
            }),
        ],
        controllers: [webinars_controller_1.WebinarsController],
        providers: [
            webinars_service_1.WebinarsService,
            {
                provide: 'SHOULD_MOCK_WEBINAR_API',
                useFactory: (configService) => {
                    const nodeEnv = configService.get('app.env') || 'development';
                    return nodeEnv === 'development';
                },
                inject: [config_1.ConfigService],
            },
        ],
    })
], WebinarsModule);
exports.WebinarsModule = WebinarsModule;
//# sourceMappingURL=webinars.module.js.map
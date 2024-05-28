"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const afy_logger_service_1 = require("./afy-logger.service");
let AfyLoggerModule = class AfyLoggerModule {
};
AfyLoggerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    if (configService.get('env') == 'test') {
                        return null;
                    }
                    const afyLoggerUrl = configService.get('afyLogger.url');
                    if (!afyLoggerUrl) {
                        throw new Error('AFY_LOGGER_URL is not defined');
                    }
                    return {
                        timeout: 5000,
                        maxRedirects: 5,
                        baseURL: afyLoggerUrl,
                    };
                },
            }),
        ],
        providers: [afy_logger_service_1.default],
        exports: [afy_logger_service_1.default],
    })
], AfyLoggerModule);
exports.default = AfyLoggerModule;
//# sourceMappingURL=afy-logger.module.js.map
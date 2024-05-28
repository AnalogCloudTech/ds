"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleModule = void 0;
const common_1 = require("@nestjs/common");
const googleapis_1 = require("googleapis");
const google_service_1 = require("./google.service");
const google_controller_1 = require("./google.controller");
const config_1 = require("@nestjs/config");
const afy_logger_module_1 = require("../../../../integrations/afy-logger/afy-logger.module");
let GoogleModule = class GoogleModule {
};
GoogleModule = __decorate([
    (0, common_1.Module)({
        imports: [afy_logger_module_1.default],
        controllers: [google_controller_1.GoogleController],
        providers: [
            {
                inject: [config_1.ConfigService],
                provide: 'GoogleAuthInput',
                useFactory: (configService) => {
                    if (configService.get('env') == 'test') {
                        return null;
                    }
                    return JSON.parse(configService.get('google.key'));
                },
            },
            {
                provide: 'GoogleCalendar',
                useFactory: async () => {
                    return googleapis_1.google.calendar({ version: 'v3' });
                },
            },
            google_service_1.GoogleService,
        ],
        exports: [google_service_1.GoogleService],
    })
], GoogleModule);
exports.GoogleModule = GoogleModule;
//# sourceMappingURL=google.module.js.map
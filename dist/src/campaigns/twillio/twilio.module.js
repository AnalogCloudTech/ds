"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioModule = void 0;
const common_1 = require("@nestjs/common");
const twilio_service_1 = require("./twilio.service");
const config_1 = require("@nestjs/config");
const constants_1 = require("./constants");
const twilio_1 = require("twilio");
const twilio_controller_1 = require("./twilio.controller");
let TwilioModule = class TwilioModule {
};
TwilioModule = __decorate([
    (0, common_1.Module)({
        providers: [
            twilio_service_1.TwilioService,
            common_1.Logger,
            {
                inject: [config_1.ConfigService],
                provide: constants_1.TwilioProviderName,
                useFactory: (configService) => {
                    if (configService.get('NODE_ENV') === 'test') {
                        return null;
                    }
                    return new twilio_1.Twilio(configService.get('twilio.accountSid'), configService.get('twilio.authToken'));
                },
            },
            {
                inject: [config_1.ConfigService],
                provide: constants_1.TwilioNumberProvider,
                useFactory: (configService) => {
                    if (configService.get('NODE_ENV') === 'test') {
                        return '';
                    }
                    return configService.get('twilio.fromPhoneNumber');
                },
            },
        ],
        controllers: [twilio_controller_1.TwilioController],
        exports: [twilio_service_1.TwilioService],
    })
], TwilioModule);
exports.TwilioModule = TwilioModule;
//# sourceMappingURL=twilio.module.js.map
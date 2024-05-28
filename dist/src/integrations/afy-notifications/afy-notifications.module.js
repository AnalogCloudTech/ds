"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfyNotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const afy_notifications_service_1 = require("./afy-notifications.service");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
let AfyNotificationsModule = class AfyNotificationsModule {
};
AfyNotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'KAFKA_CLIENT',
                    inject: [config_1.ConfigService],
                    useFactory: (configService) => {
                        return {
                            transport: microservices_1.Transport.KAFKA,
                            options: {
                                consumer: {
                                    groupId: 'digital-services',
                                    sessionTimeout: 900000,
                                    heartbeatInterval: 30000,
                                    retry: {
                                        retries: 3,
                                    },
                                },
                                client: {
                                    clientId: (0, uuid_1.v4)() || 'digital-services',
                                    brokers: configService
                                        .get('aws.msk.kafka.brokers')
                                        .split(','),
                                    requestTimeout: 90000,
                                    retry: {
                                        retries: 3,
                                    },
                                },
                            },
                        };
                    },
                },
            ]),
        ],
        providers: [afy_notifications_service_1.AfyNotificationsService, common_1.Logger],
        exports: [afy_notifications_service_1.AfyNotificationsService],
    })
], AfyNotificationsModule);
exports.AfyNotificationsModule = AfyNotificationsModule;
//# sourceMappingURL=afy-notifications.module.js.map
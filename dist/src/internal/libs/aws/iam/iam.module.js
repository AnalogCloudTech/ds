"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IamModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const constants_1 = require("./constants");
const aws_sdk_1 = require("aws-sdk");
const iam_service_1 = require("./iam.service");
let IamModule = class IamModule {
};
IamModule = __decorate([
    (0, common_1.Module)({
        providers: [
            iam_service_1.IamService,
            {
                inject: [config_1.ConfigService],
                provide: constants_1.IamProviderName,
                useFactory: (configService) => {
                    return new aws_sdk_1.IAM({
                        region: configService.get('aws.region'),
                        credentials: {
                            accessKeyId: configService.get('aws.accessKeyId'),
                            secretAccessKey: configService.get('aws.secretAccessKey'),
                        },
                    });
                },
            },
        ],
        exports: [iam_service_1.IamService, constants_1.IamProviderName],
    })
], IamModule);
exports.IamModule = IamModule;
//# sourceMappingURL=iam.module.js.map
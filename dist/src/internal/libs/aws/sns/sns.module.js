"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnsModule = void 0;
const common_1 = require("@nestjs/common");
const sns_service_1 = require("./sns.service");
const config_1 = require("@nestjs/config");
const aws_sdk_1 = require("aws-sdk");
const iam_module_1 = require("../iam/iam.module");
const contants_1 = require("./contants");
let SnsModule = class SnsModule {
};
SnsModule = __decorate([
    (0, common_1.Module)({
        imports: [iam_module_1.IamModule],
        providers: [
            sns_service_1.SnsService,
            common_1.Logger,
            {
                inject: [config_1.ConfigService],
                provide: contants_1.SnsProviderName,
                useFactory: (configService) => {
                    return new aws_sdk_1.SNS({
                        region: configService.get('aws.region'),
                        credentials: {
                            accessKeyId: configService.get('aws.accessKeyId'),
                            secretAccessKey: configService.get('aws.secretAccessKey'),
                        },
                    });
                },
            },
        ],
        exports: [sns_service_1.SnsService, contants_1.SnsProviderName, iam_module_1.IamModule],
    })
], SnsModule);
exports.SnsModule = SnsModule;
//# sourceMappingURL=sns.module.js.map
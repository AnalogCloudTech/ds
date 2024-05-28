"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SesModule = void 0;
const common_1 = require("@nestjs/common");
const ses_service_1 = require("./ses.service");
const config_1 = require("@nestjs/config");
const aws_sdk_1 = require("aws-sdk");
const constants_1 = require("./constants");
const iam_module_1 = require("../iam/iam.module");
const ses_custom_verification_email_template_controller_1 = require("./ses.custom-verification-email-template.controller");
let SesModule = class SesModule {
};
SesModule = __decorate([
    (0, common_1.Module)({
        imports: [iam_module_1.IamModule],
        providers: [
            ses_service_1.SesService,
            common_1.Logger,
            {
                inject: [config_1.ConfigService],
                provide: constants_1.SesProviderName,
                useFactory: (configService) => {
                    return new aws_sdk_1.SES({
                        region: configService.get('aws.region'),
                        credentials: {
                            accessKeyId: configService.get('aws.accessKeyId'),
                            secretAccessKey: configService.get('aws.secretAccessKey'),
                        },
                    });
                },
            },
        ],
        exports: [ses_service_1.SesService, constants_1.SesProviderName, iam_module_1.IamModule],
        controllers: [ses_custom_verification_email_template_controller_1.SesCustomVerificationEmailTemplateController],
    })
], SesModule);
exports.SesModule = SesModule;
//# sourceMappingURL=ses.module.js.map
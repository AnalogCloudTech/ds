"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSConfigBootstrap = void 0;
const aws_sdk_1 = require("aws-sdk");
const config_1 = require("@nestjs/config");
async function AWSConfigBootstrap(app) {
    const configService = app.get(config_1.ConfigService);
    aws_sdk_1.config.update({
        accessKeyId: configService.get('aws.accessKeyId'),
        secretAccessKey: configService.get('aws.secretAccessKey'),
        region: configService.get('aws.region'),
    });
}
exports.AWSConfigBootstrap = AWSConfigBootstrap;
//# sourceMappingURL=aws.js.map
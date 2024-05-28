"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppBootstrap = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("../../app.module");
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const config_1 = require("@nestjs/config");
const aws_1 = require("./aws");
const logger_1 = require("./logger");
const logger_interceptor_1 = require("../common/interceptors/logger.interceptor");
const helmet_1 = require("helmet");
async function ServicesBootstrap(app) {
    await (0, logger_1.LoggerBootstrap)(app);
    await (0, aws_1.AWSConfigBootstrap)(app);
}
async function AppBootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        origin: '*',
        allowedHeaders: ['*'],
    });
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    app.use((0, helmet_1.default)());
    app.useGlobalInterceptors(new logger_interceptor_1.LoggerInterceptor());
    const appPort = configService.get('app.port');
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    await ServicesBootstrap(app);
    await app.listen(appPort);
}
exports.AppBootstrap = AppBootstrap;
//# sourceMappingURL=app.js.map
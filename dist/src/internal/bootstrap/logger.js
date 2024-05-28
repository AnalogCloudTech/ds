"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerBootstrap = void 0;
const winston = require("winston");
const nest_winston_1 = require("nest-winston");
const logstash_1 = require("./logstash");
const config_1 = require("@nestjs/config");
async function LoggerBootstrap(app) {
    const configService = app.get(config_1.ConfigService);
    const logger = winston.createLogger({
        levels: winston.config.npm.levels,
        transports: [
            new winston.transports.Console({
                format: winston.format.json(),
                level: configService.get('logger.level'),
            }),
        ],
    });
    await (0, logstash_1.LogStashTransporter)(app, logger);
    const loggerInstance = new nest_winston_1.WinstonLogger(logger);
    app.useLogger(loggerInstance);
}
exports.LoggerBootstrap = LoggerBootstrap;
//# sourceMappingURL=logger.js.map
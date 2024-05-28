"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogStashTransporter = void 0;
const config_1 = require("@nestjs/config");
const winston = require("winston");
const contexts_1 = require("../common/contexts");
async function LogStashTransporter(app, logger) {
    const configService = app.get(config_1.ConfigService);
    const logstashFilter = winston.format(function (info) {
        const { context } = info;
        if (contexts_1.CONTEXTS.includes(context)) {
            const { payload } = info;
            return Object.assign(Object.assign({}, payload), { logstashContext: context });
        }
        return false;
    });
    const logstashTransport = new winston.transports.Http({
        host: configService.get('logstash.host'),
        port: configService.get('logstash.port'),
        auth: {
            username: configService.get('logstash.username'),
            password: configService.get('logstash.password'),
        },
        level: configService.get('logstash.level'),
        format: winston.format.combine(logstashFilter(), winston.format.json()),
    });
    logger.add(logstashTransport);
}
exports.LogStashTransporter = LogStashTransporter;
//# sourceMappingURL=logstash.js.map
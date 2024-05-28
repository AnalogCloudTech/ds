import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { CONTEXTS } from '@/internal/common/contexts';
import { INestApplication } from '@nestjs/common';

export async function LogStashTransporter(
  app: INestApplication,
  logger: winston.Logger,
) {
  const configService = app.get<ConfigService>(ConfigService);

  const logstashFilter = winston.format(function (info) {
    const { context } = info;
    if (CONTEXTS.includes(context)) {
      const { payload } = info;
      return { ...payload, logstashContext: context };
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

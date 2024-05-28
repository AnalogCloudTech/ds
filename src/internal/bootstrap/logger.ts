import * as winston from 'winston';
import { WinstonLogger } from 'nest-winston';
import { LogStashTransporter } from '@/internal/bootstrap/logstash';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export async function LoggerBootstrap(app: INestApplication) {
  const configService = app.get<ConfigService>(ConfigService);

  const logger = winston.createLogger({
    levels: winston.config.npm.levels,
    transports: [
      new winston.transports.Console({
        format: winston.format.json(),
        level: configService.get('logger.level'),
      }),
    ],
  });
  await LogStashTransporter(app, logger);
  const loggerInstance = new WinstonLogger(logger);

  app.useLogger(loggerInstance);
}

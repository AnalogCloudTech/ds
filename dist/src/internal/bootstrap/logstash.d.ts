import * as winston from 'winston';
import { INestApplication } from '@nestjs/common';
export declare function LogStashTransporter(app: INestApplication, logger: winston.Logger): Promise<void>;

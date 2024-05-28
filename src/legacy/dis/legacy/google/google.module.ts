import { Module } from '@nestjs/common';
import { google } from 'googleapis';

import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { ConfigService } from '@nestjs/config';
import AfyLoggerModule from '@/integrations/afy-logger/afy-logger.module';

@Module({
  imports: [AfyLoggerModule],
  controllers: [GoogleController],
  providers: [
    {
      inject: [ConfigService],
      provide: 'GoogleAuthInput',
      useFactory: (configService: ConfigService) => {
        if (configService.get<string>('env') == 'test') {
          return null;
        }

        return <object>JSON.parse(configService.get<string>('google.key'));
      },
    },
    {
      provide: 'GoogleCalendar',
      useFactory: async () => {
        return google.calendar({ version: 'v3' });
      },
    },
    GoogleService,
  ],
  exports: [GoogleService],
})
export class GoogleModule {}

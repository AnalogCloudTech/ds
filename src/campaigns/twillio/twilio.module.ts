import { Logger, Module } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { ConfigService } from '@nestjs/config';
import {
  TwilioNumberProvider,
  TwilioProviderName,
} from '@/campaigns/twillio/constants';
import { Twilio } from 'twilio';
import { TwilioController } from '@/campaigns/twillio/twilio.controller';

@Module({
  providers: [
    TwilioService,
    Logger,
    {
      inject: [ConfigService],
      provide: TwilioProviderName,
      useFactory: (configService: ConfigService): Twilio => {
        if (configService.get('NODE_ENV') === 'test') {
          return null;
        }
        return new Twilio(
          configService.get('twilio.accountSid'),
          configService.get('twilio.authToken'),
        );
      },
    },
    {
      inject: [ConfigService],
      provide: TwilioNumberProvider,
      useFactory: (configService: ConfigService): string => {
        if (configService.get('NODE_ENV') === 'test') {
          return '';
        }
        return configService.get<string>('twilio.fromPhoneNumber');
      },
    },
  ],
  controllers: [TwilioController],
  exports: [TwilioService],
})
export class TwilioModule {}

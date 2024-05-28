import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { GoogleModule } from '@/legacy/dis/legacy/google/google.module';
import { HubspotModule } from '@/legacy/dis/legacy/hubspot/hubspot.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [GoogleModule, HubspotModule],
  exports: [CalendarService],
  providers: [
    CalendarService,
    {
      inject: [ConfigService],
      provide: 'SCHEDULE_COACH_DURATION',
      useFactory: (configService: ConfigService): number => {
        return configService.get<number>(
          'onboardSettings.scheduleCoachDuration',
        );
      },
    },
  ],
})
export class CalendarModule {}

import { forwardRef, Module } from '@nestjs/common';
import { DentistCoachesService } from './dentist-coaches.service';
import { DentistCoachesController } from './dentist-coaches.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DentistCoach,
  DentistCoachSchema,
} from './schemas/dentist-coach.schema';
import { EmailRemindersModule } from '@/onboard/email-reminders/email-reminders.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DentistCoach.name, schema: DentistCoachSchema },
    ]),
    forwardRef(() => EmailRemindersModule),
  ],
  providers: [DentistCoachesService],
  controllers: [DentistCoachesController],
  exports: [DentistCoachesService],
})
export class DentistCoachesModule {}

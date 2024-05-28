import { forwardRef, Logger, Module } from '@nestjs/common';
import { EmailRemindersService } from './email-reminders.service';
import { EmailRemindersController } from './controllers/email-reminders.controller';
import { EmailRemindersRepository } from '@/onboard/email-reminders/repositories/email-reminders.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EmailReminder,
  EmailReminderSchema,
} from '@/onboard/email-reminders/schemas/email-reminder.schema';
import { CoachesModule } from '@/onboard/coaches/coaches.module';
import { SesModule } from '@/internal/libs/aws/ses/ses.module';
import { HubspotModule } from '@/legacy/dis/legacy/hubspot/hubspot.module';
import { TwilioModule } from '@/campaigns/twillio/twilio.module';
import { SmsTemplatesModule } from '@/campaigns/sms/sms-templates/sms-templates.module';
import { DentistCoachesModule } from '@/onboard/dentist-coaches/dentist-coaches.module';
import { EmailRemindersTriggersControllers } from '@/onboard/email-reminders/controllers/email-reminders-triggers.controllers';

@Module({
  imports: [
    forwardRef(() => CoachesModule),
    forwardRef(() => DentistCoachesModule),
    SesModule,
    TwilioModule,
    HubspotModule,
    SmsTemplatesModule,
    MongooseModule.forFeature([
      { name: EmailReminder.name, schema: EmailReminderSchema },
    ]),
  ],
  controllers: [EmailRemindersController, EmailRemindersTriggersControllers],
  providers: [EmailRemindersService, EmailRemindersRepository, Logger],
  exports: [EmailRemindersService],
})
export class EmailRemindersModule {}

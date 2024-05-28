import { forwardRef, Logger, Module } from '@nestjs/common';
import { OnDemandEmailsService } from './on-demand-emails.service';
import { OnDemandEmailsController } from './controllers/on-demand-emails.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OnDemandEmail,
  OnDemandEmailSchema,
} from './schemas/on-demand-email.schema';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { SesModule } from '@/internal/libs/aws/ses/ses.module';
import { DisModule } from '@/legacy/dis/dis.module';
import { LeadsModule } from '@/campaigns/email-campaigns/leads/leads.module';
import { TemplatesModule } from '@/campaigns/email-campaigns/templates/templates.module';
import { EmailHistoryModule } from '@/campaigns/email-campaigns/email-history/email-history.module';
import { SegmentsModule } from '@/campaigns/email-campaigns/segments/segments.module';
import { AfyNotificationsModule } from '@/integrations/afy-notifications/afy-notifications.module';
import { OnDemandEmailsTriggersController } from '@/campaigns/email-campaigns/on-demand-emails/controllers/on-demand-emails-triggers.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OnDemandEmail.name, schema: OnDemandEmailSchema },
    ]),
    SesModule,
    DisModule,
    LeadsModule,
    forwardRef(() => TemplatesModule),
    forwardRef(() => EmailHistoryModule),
    SegmentsModule,
    AfyNotificationsModule,
  ],
  controllers: [OnDemandEmailsController, OnDemandEmailsTriggersController],
  providers: [Logger, OnDemandEmailsService, SesService],
  exports: [OnDemandEmailsService],
})
export class OnDemandEmailsModule {}

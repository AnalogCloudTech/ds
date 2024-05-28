import { forwardRef, Module } from '@nestjs/common';
import { EmailHistoryService } from './email-history.service';
import { EmailHistoryController } from './email-history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EmailHistory,
  EmailHistorySchema,
} from '@/campaigns/email-campaigns/email-history/schemas/email-history.schema';
import { OnDemandEmailsModule } from '../on-demand-emails/on-demand-emails.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { LeadsModule } from '../leads/leads.module';
import { LoggerWithContext } from '@/internal/utils/logger';
import { CONTEXT_EMAIL_HISTORY } from '@/internal/common/contexts';
import { EmailHistoryRepository } from '@/campaigns/email-campaigns/email-history/email-history.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailHistory.name, schema: EmailHistorySchema },
    ]),
    LeadsModule,
    forwardRef(() => CampaignsModule),
    forwardRef(() => OnDemandEmailsModule),
  ],
  controllers: [EmailHistoryController],
  providers: [
    EmailHistoryService,
    EmailHistoryRepository,
    LoggerWithContext(CONTEXT_EMAIL_HISTORY),
  ],
  exports: [EmailHistoryService],
})
export class EmailHistoryModule {}

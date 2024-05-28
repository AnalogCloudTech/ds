import { OnQueueCompleted, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { DateTime } from 'luxon';
import { Logger } from '@nestjs/common';
import { CONTEXT_ON_BOARD_EMAIL } from '@/internal/common/contexts';
import { COACHING_REMINDER_EMAIL_NAME } from './constants';
import { OnboardService } from './onboard.service';
import { EmailReminder } from '@/onboard/dto/email-reminder.dto';

/**
 * @deprecated
 */
@Processor(COACHING_REMINDER_EMAIL_NAME)
export class OnboardConsumer {
  constructor(
    public readonly service: OnboardService,
    private readonly logger: Logger,
  ) {}

  /**
   * @deprecated
   */
  public buildPayload(emailReminder: EmailReminder): object {
    return {
      ...emailReminder,
      usageDate: DateTime.now(),
    };
  }

  public async sendToES(payload: object): Promise<any> {
    return this.logger.log({ payload }, CONTEXT_ON_BOARD_EMAIL);
  }

  @OnQueueCompleted()
  public async onCompleted(job: Job) {
    const emailReminder: EmailReminder = job.data;
    const payload = this.buildPayload(emailReminder);
    return this.sendToES(payload);
  }
}

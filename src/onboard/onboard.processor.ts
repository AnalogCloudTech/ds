import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import {
  COACHING_REMINDER_EMAIL_NAME,
  COACHING_REMINDER_EMAIL_PROCESSOR,
} from './constants';
import { EmailReminder } from './dto/email-reminder.dto';

/**
 * @deprecated
 */
@Processor(COACHING_REMINDER_EMAIL_NAME)
export class OnboardProcessor {
  constructor(private readonly sesService: SesService) {}

  @Process(COACHING_REMINDER_EMAIL_PROCESSOR)
  public async handleSendMail(job: Job<EmailReminder>) {
    const emailReminder: EmailReminder = job.data;

    const params = await this.sesService.buildSingleEmailParams(emailReminder);
    const sendSingleEmail = await this.sesService.sendSingleEmail(params);

    return sendSingleEmail.MessageId;
  }
}

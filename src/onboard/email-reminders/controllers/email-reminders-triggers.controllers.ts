import { EmailRemindersService } from '@/onboard/email-reminders/email-reminders.service';
import { Controller, Post } from '@nestjs/common';
import { ApiKeyOnly } from '@/auth/auth.service';

@Controller('email-reminders-triggers')
export class EmailRemindersTriggersControllers {
  constructor(private readonly emailRemindersService: EmailRemindersService) {}

  @ApiKeyOnly()
  @Post('email-reminders-cron')
  async emailRemindersCron() {
    return this.emailRemindersService.emailRemindersCron();
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EmailRemindersService } from '../email-reminders.service';
import { RescheduleRemindersDto } from '@/onboard/email-reminders/dto/reschedule-reminders.dto';
import { SchemaId } from '@/internal/types/helpers';
import { IsAdminGuard } from '@/internal/common/guards/is-admin.guard';

@Controller({ path: 'onboard/email-reminders', version: '1' })
export class EmailRemindersController {
  constructor(private readonly emailRemindersService: EmailRemindersService) {}

  @Get('get-reminders-from-customer/:email')
  getRemindersFromCustomer(@Param('email') email: string) {
    return this.emailRemindersService.getRemindersFromCustomer(email);
  }

  @Post('reschedule-reminders')
  rescheduleReminders(
    @Body(ValidationPipe) rescheduleRemindersDto: RescheduleRemindersDto,
  ) {
    return this.emailRemindersService.rescheduleReminders(
      rescheduleRemindersDto,
    );
  }

  @UseGuards(IsAdminGuard)
  @Patch('cancel-reminder/:id')
  cancelScheduledReminderStatus(@Param('id') id: SchemaId) {
    return this.emailRemindersService.cancelScheduledReminderStatus(id);
  }
}

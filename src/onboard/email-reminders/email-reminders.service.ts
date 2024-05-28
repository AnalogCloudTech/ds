import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmailReminderDto } from './dto/create-email-reminder.dto';
import { UpdateEmailReminderDto } from './dto/update-email-reminder.dto';
import { EmailRemindersRepository } from './repositories/email-reminders.repository';
import { FilterQuery, ObjectId } from 'mongoose';
import { EmailReminderDocument } from '@/onboard/email-reminders/schemas/email-reminder.schema';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';
import { SessionDocument } from '@/onboard/schemas/session.schema';
import { DateTime } from 'luxon';
import { ReminderDelays, Status } from '@/onboard/email-reminders/domain/types';
import { CustomersService } from '@/customers/customers/customers.service';
import { RescheduleRemindersDto } from '@/onboard/email-reminders/dto/reschedule-reminders.dto';
import { first } from 'lodash';
import { SchemaId } from '@/internal/types/helpers';
import { LoggerPayload } from '@/internal/utils/logger';
import {
  CONTEXT_ERROR,
  CONTEXT_SCHEDULER_MANAGER,
} from '@/internal/common/contexts';
import { SesService } from '@/internal/libs/aws/ses/ses.service';

@Injectable()
export class EmailRemindersService {
  private readonly logger = new Logger(EmailRemindersService.name);

  constructor(
    private readonly repository: EmailRemindersRepository,
    private readonly customersService: CustomersService,
    private readonly sesService: SesService,
  ) {}

  create(createEmailReminderDto: CreateEmailReminderDto) {
    return this.repository.create(createEmailReminderDto);
  }

  findAll(filters: FilterQuery<EmailReminderDocument>) {
    return this.repository.findAll(filters);
  }

  update(id: SchemaId, updateEmailReminderDto: UpdateEmailReminderDto) {
    return this.repository.update(id, updateEmailReminderDto);
  }

  async sendAllRemindersEmail(
    customer: CustomerDocument,
    coach: CoachDocument,
    session: SessionDocument,
    date: DateTime,
    timezone: string,
    isRescheduling = false,
  ) {
    const promises: Array<Promise<EmailReminderDocument>> = [
      this.repository.sendEmailReminder(
        customer,
        coach,
        session,
        date,
        timezone,
        ReminderDelays.FIFTEEN_MINUTES,
      ),
      this.repository.sendEmailReminder(
        customer,
        coach,
        session,
        date,
        timezone,
        ReminderDelays.ONE_HOUR,
      ),
      this.repository.sendEmailReminder(
        customer,
        coach,
        session,
        date,
        timezone,
        ReminderDelays.FOUR_HOURS,
      ),
    ];

    if (!isRescheduling) {
      promises.push(
        this.repository.sendEmailReminder(
          customer,
          coach,
          session,
          date,
          timezone,
          ReminderDelays.CONFIRMATION,
        ),
      );
    }

    return Promise.all(promises);
  }

  async getRemindersFromCustomer(
    email: string,
  ): Promise<Array<EmailReminderDocument>> {
    const customer = await this.customersService.findByEmail(email);

    if (!customer) {
      throw new NotFoundException({
        message: 'Customer not found',
        method: 'EmailRemindersService@getRemindersFromCustomer',
      });
    }

    return this.repository.getFromCustomer(customer);
  }

  async rescheduleReminders(rescheduleRemindersDto: RescheduleRemindersDto) {
    const { customerEmail, newMeetingDate, timezone } = rescheduleRemindersDto;
    const customer = await this.customersService.findByEmail(customerEmail);
    await this.repository.setRemindersRescheduledFromCustomer(customer);

    const oldReminders = await this.findAll({
      customer: { $eq: customer._id },
    });

    const {
      coach,
      session,
      timezone: origTimezone,
    } = first<EmailReminderDocument>(oldReminders);
    const meetingTimezone = timezone ?? origTimezone ?? 'EST';
    const meetingDate = DateTime.fromISO(newMeetingDate, {
      zone: meetingTimezone,
    });
    const isRescheduling = true;

    return this.sendAllRemindersEmail(
      customer,
      <CoachDocument>coach,
      <SessionDocument>session,
      meetingDate,
      meetingTimezone,
      isRescheduling,
    );
  }

  async removeAllRemindersFromCoach(coachId: ObjectId | string) {
    const query: FilterQuery<EmailReminderDocument> = {
      coach: { $eq: coachId },
    };
    return this.repository.removeFromQuery(query);
  }

  async cancelScheduledReminderStatus(
    id: SchemaId,
  ): Promise<EmailReminderDocument> {
    const query: FilterQuery<EmailReminderDocument> = {
      _id: { $eq: id },
    };
    const prop = await this.repository.findOne(query);
    if (!prop) {
      throw new NotFoundException('Reminder not found');
    }
    return this.repository.cancelScheduledReminderStatus(id);
  }

  async deleteAllFromFilter(
    filter: FilterQuery<EmailReminderDocument>,
  ): Promise<number> {
    return this.repository.deleteAllFromFilter(filter);
  }

  async emailRemindersCron() {
    const filters: FilterQuery<EmailReminderDocument> = {
      status: Status.SCHEDULED,
      date: { $lt: DateTime.now() },
    };
    const reminders = await this.findAll(filters);

    for (const reminder of reminders) {
      if (!reminder.customer) {
        this.logger.error(
          {
            payload: <LoggerPayload>{
              usageDate: DateTime.now(),
              reminderId: reminder._id.toString(),
              error: 'missing customer in reminder',
              subcontext: CONTEXT_SCHEDULER_MANAGER,
            },
          },
          '',
          CONTEXT_ERROR,
        );
        await this.update(reminder._id, <UpdateEmailReminderDto>{
          status: Status.ERROR,
        });
        continue;
      }

      try {
        const params = await this.sesService.buildEmailReminderParams(reminder);
        const sendResponse = await this.sesService.sendSingleEmail(params);
        await this.update(reminder._id, <UpdateEmailReminderDto>{
          status: Status.SENT,
          messageId: sendResponse.MessageId,
        });
      } catch (error) {
        if (error instanceof Error) {
          await this.update(reminder._id, <UpdateEmailReminderDto>{
            status: Status.ERROR,
          });
          this.logger.error(
            {
              payload: <LoggerPayload>{
                usageDate: DateTime.now(),
                reminderId: reminder._id.toString(),
                error,
                subcontext: CONTEXT_SCHEDULER_MANAGER,
              },
            },
            '',
            CONTEXT_ERROR,
          );
        }
      }
    }
  }
}

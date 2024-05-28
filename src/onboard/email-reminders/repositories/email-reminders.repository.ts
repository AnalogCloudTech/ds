import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  EmailReminder,
  EmailReminderDocument,
} from '@/onboard/email-reminders/schemas/email-reminder.schema';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { CreateEmailReminderDto } from '@/onboard/email-reminders/dto/create-email-reminder.dto';
import { UpdateEmailReminderDto } from '@/onboard/email-reminders/dto/update-email-reminder.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';
import { SessionDocument } from '@/onboard/schemas/session.schema';
import { DateTime } from 'luxon';
import { ReminderDelays, Status } from '@/onboard/email-reminders/domain/types';
import { get } from 'lodash';
import { DeleteResult } from 'mongodb';
import { SchemaId } from '@/internal/types/helpers';

@Injectable()
export class EmailRemindersRepository {
  constructor(
    @InjectModel(EmailReminder.name)
    private readonly emailReminderModel: Model<EmailReminderDocument>,
  ) {}

  create(dto: CreateEmailReminderDto) {
    return this.emailReminderModel.create(dto);
  }

  async findAll(
    filters: FilterQuery<EmailReminderDocument>,
  ): Promise<Array<EmailReminderDocument>> {
    return this.emailReminderModel
      .find(filters)
      .populate(['customer', 'coach', 'session'])
      .exec();
  }

  async update(
    id: SchemaId,
    updateEmailReminderDto: UpdateEmailReminderDto,
  ): Promise<EmailReminderDocument> {
    return this.emailReminderModel.findByIdAndUpdate(
      id,
      updateEmailReminderDto,
      {
        new: true,
      },
    );
  }

  async getFromCustomer(
    customer: CustomerDocument,
  ): Promise<Array<EmailReminderDocument>> {
    const filter: FilterQuery<EmailReminderDocument> = {
      customer: { $eq: customer._id },
    };
    return this.emailReminderModel.find(filter).exec();
  }

  async sendEmailReminder(
    customer: CustomerDocument,
    coach: CoachDocument,
    session: SessionDocument,
    date: DateTime,
    timezone: string,
    delay: ReminderDelays,
  ): Promise<EmailReminderDocument> {
    const subject = this.getEmailSubject(delay, customer);
    const meetingDate = date.toJSDate();
    const condition =
      get(coach, 'meetingLink', false) && get(customer, 'firstName', false);

    if (!condition) {
      throw new HttpException(
        {
          message: `Unable to create reminders for customer: ${customer._id}`,
          session: session._id,
          customer: customer._id,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const jsDate =
      delay === ReminderDelays.CONFIRMATION
        ? /**
           * @description if confirmation, send now.
           */
          DateTime.now().toJSDate()
        : /**
           * else, use meeting date and schedule.
           */
          date.minus({ minutes: delay }).toJSDate();
    const dto = <CreateEmailReminderDto>{
      customer: customer._id,
      coach: coach._id,
      session: session._id,
      meetingLink: coach.meetingLink,
      subject,
      date: jsDate,
      meetingDate,
      timezone: timezone,
    };

    return this.create(dto);
  }

  async setRescheduled(reminders: Array<EmailReminderDocument>): Promise<void> {
    const filters: FilterQuery<EmailReminderDocument> = {
      _id: {
        $in: reminders.map((emailReminder) => emailReminder._id),
      },
      status: Status.SCHEDULED,
    };
    const update: UpdateQuery<EmailReminderDocument> = {
      status: Status.RESCHEDULED,
    };

    await this.emailReminderModel
      .updateMany(filters, update, {
        new: true,
      })
      .exec();
  }

  async setRemindersRescheduledFromCustomer(
    customer: CustomerDocument,
  ): Promise<void> {
    const filter: FilterQuery<EmailReminderDocument> = {
      customer: customer._id,
    };
    const reminders = await this.findAll(filter);
    await this.setRescheduled(reminders);
  }

  async removeFromQuery(
    query: FilterQuery<EmailReminderDocument>,
  ): Promise<DeleteResult> {
    return this.emailReminderModel.deleteMany(query).exec();
  }

  private getEmailSubject(
    delay: ReminderDelays,
    { firstName }: CustomerDocument,
  ) {
    const { IMMEDIATE, FIFTEEN_MINUTES, ONE_HOUR, FOUR_HOURS, CONFIRMATION } =
      ReminderDelays;

    switch (delay) {
      case CONFIRMATION:
        return '[Meeting Confirmation] Authorify Introductory Call';
      case IMMEDIATE: //@TODO not used anymore, remove in the next version
        return `${firstName}, the Meeting is Starting Now!`;
      case FIFTEEN_MINUTES:
        return `${firstName}, the Meeting is Starting Now!`;
      case ONE_HOUR:
        return `It's almost time! Today's meeting starts in just 1 hour`;
      case FOUR_HOURS:
        return `${firstName}, ready to get Listings with your Authorify membership?`;
      default:
        return '';
    }
  }

  async cancelScheduledReminderStatus(
    id: SchemaId,
  ): Promise<EmailReminderDocument> {
    return this.emailReminderModel.findByIdAndUpdate(
      id,
      { status: Status.CANCELED },
      {
        new: true,
      },
    );
  }

  async findOne(
    query: FilterQuery<EmailReminderDocument>,
  ): Promise<EmailReminderDocument> {
    return this.emailReminderModel.findOne(query).exec();
  }

  async deleteAllFromFilter(
    filter: FilterQuery<EmailReminderDocument>,
  ): Promise<number> {
    const deleteResults = await this.emailReminderModel.deleteMany(filter);
    return deleteResults.deletedCount;
  }
}

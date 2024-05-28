import { ObjectId } from 'mongoose';
import { Expose, Type } from 'class-transformer';
import { Status } from '@/onboard/email-reminders/domain/types';

export class EmailReminder {
  @Expose()
  id: ObjectId;

  @Expose()
  customer: ObjectId;

  @Expose()
  coach: ObjectId;

  @Expose()
  subject: string;

  @Expose()
  @Type(() => Date)
  date: Date;

  @Expose()
  status: Status;
}

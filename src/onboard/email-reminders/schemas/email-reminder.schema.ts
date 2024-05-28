import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { CustomerId } from '@/campaigns/email-campaigns/leads/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CoachId } from '@/onboard/coaches/domain/types';
import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';
import { Type } from 'class-transformer';
import { Status } from '@/onboard/email-reminders/domain/types';
import { SessionId } from '@/onboard/domain/types';
import { SessionDocument } from '@/onboard/schemas/session.schema';
import { DateTime } from 'luxon';
import { SNSMessage } from '@/campaigns/email-campaigns/email-history/utils/parse-sns-response';

@Schema({
  timestamps: true,
  collection: 'ds__onboard__email_reminders',
  toJSON: { virtuals: true },
})
export class EmailReminder {
  @Prop({ required: true, ref: 'Customer', type: SchemaTypes.ObjectId })
  customer: CustomerId | CustomerDocument;

  @Prop({ required: true, ref: 'Coach', type: SchemaTypes.ObjectId })
  coach: CoachId | CoachDocument;

  @Prop({ required: true, ref: 'Session', type: SchemaTypes.ObjectId })
  session: SessionId | SessionDocument;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  meetingLink: string;

  @Prop({ required: true })
  @Type(() => Date)
  date: Date;

  @Prop({ required: true })
  @Type(() => Date)
  meetingDate: Date;

  @Prop({ required: true })
  timezone: string;

  @Prop({
    required: true,
    enum: Status,
    default: Status.SCHEDULED,
    type: String,
  })
  status: string;

  @Prop({ default: null })
  messageId: string;

  @Prop({ default: [], type: Array<SNSMessage> })
  snsResponses: Array<SNSMessage>;

  @Prop({ default: null, type: String })
  smsId: string;

  /**
   * @description Virtual Property
   */
  meetingDateFormatted: string;
}

export type EmailReminderDocument = HydratedDocument<EmailReminder>;
const EmailReminderSchema = SchemaFactory.createForClass(EmailReminder);

EmailReminderSchema.virtual('meetingDateFormatted').get(function (
  this: EmailReminderDocument,
): string {
  const dateString = DateTime.fromJSDate(this.meetingDate)
    .setZone(this.timezone)
    .toLocaleString(DateTime.DATETIME_SHORT, {
      locale: 'en-US',
    });

  return `${dateString} (${this.timezone})`;
});

export { EmailReminderSchema };

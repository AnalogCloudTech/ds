import { HydratedDocument } from 'mongoose';
import { CustomerId } from '@/campaigns/email-campaigns/leads/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CoachId } from '@/onboard/coaches/domain/types';
import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';
import { SessionId } from '@/onboard/domain/types';
import { SessionDocument } from '@/onboard/schemas/session.schema';
import { SNSMessage } from '@/campaigns/email-campaigns/email-history/utils/parse-sns-response';
export declare class EmailReminder {
    customer: CustomerId | CustomerDocument;
    coach: CoachId | CoachDocument;
    session: SessionId | SessionDocument;
    subject: string;
    meetingLink: string;
    date: Date;
    meetingDate: Date;
    timezone: string;
    status: string;
    messageId: string;
    snsResponses: Array<SNSMessage>;
    smsId: string;
    meetingDateFormatted: string;
}
export type EmailReminderDocument = HydratedDocument<EmailReminder>;
declare const EmailReminderSchema: import("mongoose").Schema<EmailReminder, import("mongoose").Model<EmailReminder, any, any, any>, any, any>;
export { EmailReminderSchema };

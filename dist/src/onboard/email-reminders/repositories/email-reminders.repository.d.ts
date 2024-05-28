import { EmailReminder, EmailReminderDocument } from '@/onboard/email-reminders/schemas/email-reminder.schema';
import { FilterQuery, Model } from 'mongoose';
import { CreateEmailReminderDto } from '@/onboard/email-reminders/dto/create-email-reminder.dto';
import { UpdateEmailReminderDto } from '@/onboard/email-reminders/dto/update-email-reminder.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';
import { SessionDocument } from '@/onboard/schemas/session.schema';
import { DateTime } from 'luxon';
import { ReminderDelays } from '@/onboard/email-reminders/domain/types';
import { DeleteResult } from 'mongodb';
import { SchemaId } from '@/internal/types/helpers';
export declare class EmailRemindersRepository {
    private readonly emailReminderModel;
    constructor(emailReminderModel: Model<EmailReminderDocument>);
    create(dto: CreateEmailReminderDto): Promise<import("mongoose").Document<unknown, any, EmailReminder> & EmailReminder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(filters: FilterQuery<EmailReminderDocument>): Promise<Array<EmailReminderDocument>>;
    update(id: SchemaId, updateEmailReminderDto: UpdateEmailReminderDto): Promise<EmailReminderDocument>;
    getFromCustomer(customer: CustomerDocument): Promise<Array<EmailReminderDocument>>;
    sendEmailReminder(customer: CustomerDocument, coach: CoachDocument, session: SessionDocument, date: DateTime, timezone: string, delay: ReminderDelays): Promise<EmailReminderDocument>;
    setRescheduled(reminders: Array<EmailReminderDocument>): Promise<void>;
    setRemindersRescheduledFromCustomer(customer: CustomerDocument): Promise<void>;
    removeFromQuery(query: FilterQuery<EmailReminderDocument>): Promise<DeleteResult>;
    private getEmailSubject;
    cancelScheduledReminderStatus(id: SchemaId): Promise<EmailReminderDocument>;
    findOne(query: FilterQuery<EmailReminderDocument>): Promise<EmailReminderDocument>;
    deleteAllFromFilter(filter: FilterQuery<EmailReminderDocument>): Promise<number>;
}

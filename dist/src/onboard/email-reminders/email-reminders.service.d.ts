import { CreateEmailReminderDto } from './dto/create-email-reminder.dto';
import { UpdateEmailReminderDto } from './dto/update-email-reminder.dto';
import { EmailRemindersRepository } from './repositories/email-reminders.repository';
import { FilterQuery, ObjectId } from 'mongoose';
import { EmailReminderDocument } from '@/onboard/email-reminders/schemas/email-reminder.schema';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';
import { SessionDocument } from '@/onboard/schemas/session.schema';
import { DateTime } from 'luxon';
import { CustomersService } from '@/customers/customers/customers.service';
import { RescheduleRemindersDto } from '@/onboard/email-reminders/dto/reschedule-reminders.dto';
import { SchemaId } from '@/internal/types/helpers';
export declare class EmailRemindersService {
    private readonly repository;
    private readonly customersService;
    constructor(repository: EmailRemindersRepository, customersService: CustomersService);
    create(createEmailReminderDto: CreateEmailReminderDto): Promise<import("mongoose").Document<unknown, any, import("@/onboard/email-reminders/schemas/email-reminder.schema").EmailReminder> & import("@/onboard/email-reminders/schemas/email-reminder.schema").EmailReminder & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(filters: FilterQuery<EmailReminderDocument>): Promise<(import("mongoose").Document<unknown, any, import("@/onboard/email-reminders/schemas/email-reminder.schema").EmailReminder> & import("@/onboard/email-reminders/schemas/email-reminder.schema").EmailReminder & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    update(id: SchemaId, updateEmailReminderDto: UpdateEmailReminderDto): Promise<import("mongoose").Document<unknown, any, import("@/onboard/email-reminders/schemas/email-reminder.schema").EmailReminder> & import("@/onboard/email-reminders/schemas/email-reminder.schema").EmailReminder & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    sendAllRemindersEmail(customer: CustomerDocument, coach: CoachDocument, session: SessionDocument, date: DateTime, timezone: string, isRescheduling?: boolean): Promise<(import("mongoose").Document<unknown, any, import("@/onboard/email-reminders/schemas/email-reminder.schema").EmailReminder> & import("@/onboard/email-reminders/schemas/email-reminder.schema").EmailReminder & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getRemindersFromCustomer(email: string): Promise<Array<EmailReminderDocument>>;
    rescheduleReminders(rescheduleRemindersDto: RescheduleRemindersDto): Promise<(import("mongoose").Document<unknown, any, import("@/onboard/email-reminders/schemas/email-reminder.schema").EmailReminder> & import("@/onboard/email-reminders/schemas/email-reminder.schema").EmailReminder & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    removeAllRemindersFromCoach(coachId: ObjectId | string): Promise<import("mongodb").DeleteResult>;
    cancelScheduledReminderStatus(id: SchemaId): Promise<EmailReminderDocument>;
    deleteAllFromFilter(filter: FilterQuery<EmailReminderDocument>): Promise<number>;
}

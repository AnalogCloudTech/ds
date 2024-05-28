/// <reference types="mongoose" />
import { EmailRemindersService } from './email-reminders.service';
import { RescheduleRemindersDto } from '@/onboard/email-reminders/dto/reschedule-reminders.dto';
import { SchemaId } from '@/internal/types/helpers';
export declare class EmailRemindersController {
    private readonly emailRemindersService;
    constructor(emailRemindersService: EmailRemindersService);
    getRemindersFromCustomer(email: string): Promise<(import("mongoose").Document<unknown, any, import("./schemas/email-reminder.schema").EmailReminder> & import("./schemas/email-reminder.schema").EmailReminder & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    rescheduleReminders(rescheduleRemindersDto: RescheduleRemindersDto): Promise<(import("mongoose").Document<unknown, any, import("./schemas/email-reminder.schema").EmailReminder> & import("./schemas/email-reminder.schema").EmailReminder & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    cancelScheduledReminderStatus(id: SchemaId): Promise<import("mongoose").Document<unknown, any, import("./schemas/email-reminder.schema").EmailReminder> & import("./schemas/email-reminder.schema").EmailReminder & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}

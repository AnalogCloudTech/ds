import { SchemaId } from '@/internal/types/helpers';
export declare class CreateEmailReminderDto {
    customer: SchemaId;
    coach: SchemaId;
    session: SchemaId;
    subject: string;
    meetingLink: string;
    date: Date;
    meetingDate: Date;
    timezone: string;
}

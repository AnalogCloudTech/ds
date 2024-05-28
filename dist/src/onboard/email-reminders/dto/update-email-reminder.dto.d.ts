import { SchemaId } from '@/internal/types/helpers';
export declare class UpdateEmailReminderDto {
    customer?: SchemaId;
    coach?: SchemaId;
    session?: SchemaId;
    subject?: string;
    meetingLink?: string;
    date?: Date;
    timezone?: string;
}

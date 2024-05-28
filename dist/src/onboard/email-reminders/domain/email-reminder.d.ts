import { ObjectId } from 'mongoose';
import { Status } from '@/onboard/email-reminders/domain/types';
export declare class EmailReminder {
    id: ObjectId;
    customer: ObjectId;
    coach: ObjectId;
    subject: string;
    date: Date;
    status: Status;
}

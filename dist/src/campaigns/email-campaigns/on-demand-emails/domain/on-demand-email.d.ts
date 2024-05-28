import { ObjectId } from 'mongoose';
import { Segments } from '@/campaigns/email-campaigns/leads/domain/types';
export declare class OnDemandEmail {
    id: ObjectId;
    subject: string;
    createdAt: Date;
    scheduleDate: Date;
    timezone: string;
    segments: Segments;
    allSegments: boolean;
    templateName: string;
    sendImmediately: boolean;
    status: string;
    completionDate: Date;
}

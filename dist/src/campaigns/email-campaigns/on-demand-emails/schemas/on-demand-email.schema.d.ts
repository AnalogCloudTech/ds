import { Segments } from '@/campaigns/email-campaigns/leads/domain/types';
import { HydratedDocument } from 'mongoose';
import { CustomerId } from '@/customers/customers/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { MessageId } from 'aws-sdk/clients/ses';
export declare class OnDemandEmail {
    subject: string;
    templateId: number;
    templateName: string;
    segments: Segments;
    allSegments: boolean;
    status: string;
    customer: CustomerId | CustomerDocument;
    sendImmediately: boolean;
    scheduleDate: Date;
    completionDate: Date;
    timezone: string;
    messageIds: MessageId[];
}
export type OnDemandEmailDocument = HydratedDocument<OnDemandEmail>;
export declare const OnDemandEmailSchema: import("mongoose").Schema<OnDemandEmail, import("mongoose").Model<OnDemandEmail, any, any, any>, any, any>;

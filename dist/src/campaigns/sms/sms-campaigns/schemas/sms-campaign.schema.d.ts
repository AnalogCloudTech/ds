import { HydratedDocument } from 'mongoose';
import { CustomerId } from '@/customers/customers/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { MessageId } from 'aws-sdk/clients/ses';
export declare class SmsCampaign {
    title: string;
    text: string;
    templateId: number;
    segments: Array<number>;
    allSegments: boolean;
    status: string;
    scheduleDate: Date;
    messageIds: Array<MessageId>;
    customer: CustomerId | CustomerDocument;
    createdAt: Date;
}
export type SmsCampaignDocument = HydratedDocument<SmsCampaign>;
export declare const SmsCampaignSchema: import("mongoose").Schema<SmsCampaign, import("mongoose").Model<SmsCampaign, any, any, any>, any, any>;

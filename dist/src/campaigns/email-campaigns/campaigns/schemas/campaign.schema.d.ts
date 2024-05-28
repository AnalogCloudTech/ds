import { CastableTo } from '@/internal/common/utils';
import { CampaignStatus, ContentId, Segments, TemplateId } from '../domain/types';
import { Campaign as DomainCampaign } from '../domain/campaign';
import { HydratedDocument, SchemaTimestampsConfig } from 'mongoose';
import { CustomerId } from '@/customers/customers/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { MessageId } from 'aws-sdk/clients/ses';
export declare class Campaign extends CastableTo<DomainCampaign> {
    name: string;
    segments: Segments;
    allowWeekend: boolean;
    startDate: Date;
    status: CampaignStatus;
    allSegments: boolean;
    contentId: ContentId;
    content: object;
    customer: CustomerId | CustomerDocument;
    messageIds: MessageId[];
    templateIds: TemplateId[];
}
export type CampaignDocument = HydratedDocument<Campaign> & SchemaTimestampsConfig;
export declare const CampaignSchema: import("mongoose").Schema<Campaign, import("mongoose").Model<Campaign, any, any, any>, any, any>;

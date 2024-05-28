import { Document } from 'mongoose';
import { CastableTo } from '@/internal/common/utils';
import { CampaignDomain } from '../domain/campaigns.domain';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CustomerId } from '@/customers/customers/domain/types';
export declare class Campaigns extends CastableTo<CampaignDomain> {
    campaignName: string;
    startDate: Date;
    status: string;
    contenId: number;
    customerId: CustomerId | CustomerDocument;
}
export type CampaignsDocument = Campaigns & Document;
export declare const CampaignsSchema: import("mongoose").Schema<Campaigns, import("mongoose").Model<Campaigns, any, any, any>, any, any>;

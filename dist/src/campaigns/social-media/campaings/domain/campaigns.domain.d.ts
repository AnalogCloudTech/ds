import { ObjectId } from 'mongoose';
export declare class CampaignDomain {
    id: ObjectId;
    campaignName: string;
    startDate: Date;
    status: string;
    contenId: string;
}

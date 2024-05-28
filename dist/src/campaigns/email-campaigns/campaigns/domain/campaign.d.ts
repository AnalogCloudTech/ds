import { CampaignId, CampaignStatus, ContentId, Segments } from './types';
export declare class Campaign {
    id: CampaignId;
    name: string;
    allowWeekend: boolean;
    startDate: string;
    status: CampaignStatus;
    allSegments: boolean;
    segments: Segments;
    createdAt: string;
    contentId: ContentId;
}

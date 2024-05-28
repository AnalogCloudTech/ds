import { CampaignStatus, ContentId, Segments } from '../domain/types';
import { SegmentsDto } from '@/internal/common/dtos/segments.dto';
import { ObjectId } from 'mongoose';
export declare class CreateCampaignDto implements SegmentsDto {
    name: string;
    allowWeekend: boolean;
    startDate: string;
    status: string;
    contentId: ContentId;
    allSegments: boolean;
    segments: Segments;
    customerId: ObjectId;
}
export declare class UpdateCampaignDto {
    name?: string;
    allowWeekend?: boolean;
    startDate?: string;
    status?: string;
    contentId?: ContentId;
    allSegments?: boolean;
    segments?: Segments;
    customerId?: ObjectId;
}
export declare class UpdateCampaignStatusDto {
    status: CampaignStatus;
}

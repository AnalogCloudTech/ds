import { Segments } from '@/campaigns/email-campaigns/leads/domain/types';
import { SegmentsDto } from '@/internal/common/dtos/segments.dto';
import { ObjectId } from 'mongoose';
export declare class CreateOnDemandEmailDto implements SegmentsDto {
    subject: string;
    templateId: number;
    segments: Segments;
    allSegments: boolean;
    customer: ObjectId;
    sendImmediately: boolean;
    scheduleDate: string;
    timezone: string;
}

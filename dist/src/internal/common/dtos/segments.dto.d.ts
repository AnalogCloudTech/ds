import { Segments } from '@/campaigns/email-campaigns/leads/domain/types';
export interface SegmentsDto {
    segments: Segments;
    allSegments: boolean;
}

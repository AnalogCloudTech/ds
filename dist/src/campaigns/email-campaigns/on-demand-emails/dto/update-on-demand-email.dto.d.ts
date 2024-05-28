import { Segments } from '@/campaigns/email-campaigns/leads/domain/types';
export declare class UpdateOnDemandEmailDto {
    subject?: string;
    templateId?: number;
    segments?: Segments;
    allSegments?: boolean;
    sendImmediately?: boolean;
    scheduleDate?: string;
    timezone?: string;
}

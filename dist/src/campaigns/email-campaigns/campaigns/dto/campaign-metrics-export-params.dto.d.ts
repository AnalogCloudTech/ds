import { SchemaId } from '@/internal/types/helpers';
export declare class CampaignMetricsExportParams {
    start: Date;
    end: Date;
    campaignIds: SchemaId[];
    bucket: string;
    email: string;
}

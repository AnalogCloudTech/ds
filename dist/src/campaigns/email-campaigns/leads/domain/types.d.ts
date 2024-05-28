import { Lead as DomainLead } from '@/campaigns/email-campaigns/leads/domain/lead';
import { SchemaId } from '@/internal/types/helpers';
export type LeadId = SchemaId;
export type Segment = number;
export type Segments = Segment[];
export type CustomerId = SchemaId;
export declare class LastUsage {
    onDemandEmail?: string;
    emailCampaign?: string;
}
export declare enum UsageFields {
    ON_DEMAND_EMAIL = "onDemandEmail",
    EMAIL_CAMPAIGN = "emailCampaign"
}
export declare enum Processors {
    csv = "fillFromRawCsvFile",
    xls = "fillFromXLSFile",
    xlsx = "fillFromXLSFile"
}
export type ImportLeadsFromFile = {
    successCount: number;
    duplicatedCount: number;
    invalidCount: number;
    successList: Array<DomainLead>;
    duplicated: Array<DomainLead>;
    invalidList: Array<DomainLead>;
};

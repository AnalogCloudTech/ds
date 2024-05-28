import { CampaignDocument } from '@/campaigns/email-campaigns/campaigns/schemas/campaign.schema';
import { SchemaId } from '@/internal/types/helpers';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { CampaignHistory } from '@/campaigns/email-campaigns/campaigns/schemas/campaign-history.schema';
import { Segment as SegmentDomain } from '@/campaigns/email-campaigns/segments/domain/segment';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Types } from 'mongoose';
import { ResponseSegmentsType } from '@/internal/utils/cms/filters/cms.filter.builder';
export type CampaignId = SchemaId;
export type Segments = number[];
export type TemplateNames = string[];
export declare enum CampaignStatus {
    ACTIVE = "active",
    DRAFT = "draft",
    STOPPED = "stopped",
    CANCELED = "canceled"
}
export type ContentId = number;
export type TemplateId = number;
export declare enum CampaignHistoryType {
    ABSOLUTE = "absolute",
    RELATIVE = "relative"
}
export declare enum CampaignHandler {
    ABSOLUTE = "sendAbsoluteCampaign",
    RELATIVE = "sendRelativeCampaign"
}
export type CampaignWithSegments = {
    segments: Array<SegmentDomain>;
} & CampaignDocument;
export type CampaignReport = {
    _id: SchemaId;
    name: string;
    templates: Array<string>;
    status: string;
    segments: Array<string>;
    totalSent: number;
    totalDelivery: number;
    totalBounce: number;
    totalComplaints: number;
    customer: Pick<CustomerDocument, '_id' | 'firstName' | 'lastName'>;
} & CampaignHistoryWithSegments;
export type CampaignHistoryWithSegments = {
    campaign: CampaignDocument;
    segments: Array<SegmentDomain>;
} & CampaignHistory;
export type CampaignEmailReportForAdmin = {
    _id: SchemaId;
    campaign: CampaignDocument;
    createdAt: Date;
    sentEmailCount: number;
    bouncedEmailCount: number;
    totalEmailCount: number;
};
export type CampaignMetricsType = {
    totalCampaignsCount: number;
    totalEmailsCount: number;
    totalEmailBouncedCount: number;
    emailCampaignPaginated: PaginatorSchematicsInterface<CampaignEmailReportForAdmin>;
};
export type CampaignTotalsCount = {
    delivery: number;
    bounce: number;
    unsubscribed: number;
    total: number;
    [key: string]: number;
};
export type CampaignBucket = {
    key: string;
    doc_count: number;
};
export type CampaignsAggregationBuckets = Array<CampaignBucket>;
export type CampaignsMetrics = {
    campaigns: number;
    history: PaginatorSchematicsInterface<CampaignReport>;
    totals: CampaignTotalsCount;
};
export type EmailMetrics = {
    data: {
        metrics: Array<{
            date: string;
            events: Array<{
                type: string;
                ref: string;
                createdAt: string;
                to: string;
                from: string;
            }>;
            meta: {
                [key: string]: number;
            };
        }>;
        metricsMeta: {
            Send: number;
            Open: number;
            Click: number;
            Bounce: number;
            Complaint: number;
            Reject: number;
            Delivery: number;
        };
        campaign: {
            id: Types.ObjectId;
            name: string;
            segments: ResponseSegmentsType[];
            allSegments: boolean;
            status: CampaignStatus;
            startDate: Date;
            allowWeekend: boolean;
            contentId: number;
            createdAt: string | boolean;
            updatedAt: string | boolean;
        };
    }[];
    total: {
        current: {
            Send: number;
            Open: number;
            Click: number;
            Bounce: number;
            Complaint: number;
            Delivery: number;
        };
        previous: {
            Send: number;
            Open: number;
            Click: number;
            Bounce: number;
            Complaint: number;
            Delivery: number;
        };
    };
    meta: {
        page: number;
        perPage: number;
        total: number;
    };
};
export type EmailMetricsCSV = {
    campaignName: string;
    eventType: string;
    from: string;
    to: string;
    timestamp: string;
};
export type CSVHeaderFormat = {
    'Campaign Name': string;
    'Event Type': string;
    From: string;
    To: string;
    Timestamp: string;
};
export type CSVUploaderJob = {
    formattedData: {
        campaignId: SchemaId;
        data: EmailMetricsCSV[];
    }[];
    customer: CustomerDocument;
    email: string;
    bucket: string;
};

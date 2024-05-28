import { CampaignsService, SendCampaignsService } from './services';
import { CreateCampaignDto, UpdateCampaignStatusDto } from './dto/campaign.dto';
import { Paginator, PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { Campaign } from '@/campaigns/email-campaigns/campaigns/domain/campaign';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { ObjectId } from 'mongoose';
import { SchemaId } from '@/internal/types/helpers';
import DateRangeDTO from '@/internal/common/dtos/date-range.dto';
import { CampaignMetricsQueryParams } from '@/campaigns/email-campaigns/campaigns/dto/campaign-metrics-query-params.dto';
import { CampaignMetricsExportParams } from '@/campaigns/email-campaigns/campaigns/dto/campaign-metrics-export-params.dto';
export declare class CampaignsController {
    private readonly service;
    private readonly sendCampaignsService;
    constructor(service: CampaignsService, sendCampaignsService: SendCampaignsService);
    getCampaigns({ page, perPage }: Paginator, customer: CustomerDocument): Promise<PaginatorSchematicsInterface>;
    getAllHistoryCampaigns({ page, perPage }: Paginator, customer: CustomerDocument): Promise<PaginatorSchematicsInterface<import("mongoose").Document<unknown, any, import("./schemas/campaign-history.schema").CampaignHistory> & import("./schemas/campaign-history.schema").CampaignHistory & {
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getCampaign(customer: CustomerDocument, id: SchemaId): Promise<Campaign>;
    createCampaign(customer: CustomerDocument, dto: CreateCampaignDto): Promise<import("./schemas/campaign.schema").CampaignDocument>;
    updateStatus(dto: UpdateCampaignStatusDto, id: SchemaId): Promise<import("./schemas/campaign.schema").CampaignDocument>;
    updateCampaign(body: CreateCampaignDto, id: SchemaId): Promise<import("./schemas/campaign.schema").CampaignDocument>;
    deleteCampaign(id: SchemaId): Promise<import("./schemas/campaign.schema").CampaignDocument>;
    getHistory(id: ObjectId): Promise<{
        id: import("mongoose").Types.ObjectId;
        campaignName: string;
        templateNames: string[];
        messageIds: string[];
        type: import("@/campaigns/email-campaigns/campaigns/domain/types").CampaignHistoryType;
        createdAt: Date;
    }[]>;
    forceSendCampaign(id: string): Promise<void>;
    getEmailCampaignMetrics({ page, perPage }: Paginator, { startDate, endDate }: DateRangeDTO): Promise<import("@/campaigns/email-campaigns/campaigns/domain/types").CampaignsMetrics>;
    getMemberEmailCampaignMetrics({ page, perPage }: Paginator, { startDate, endDate }: DateRangeDTO, customer: CustomerDocument): Promise<import("@/campaigns/email-campaigns/campaigns/domain/types").CampaignsMetrics>;
    getMetrics({ page, perPage }: Paginator, options: CampaignMetricsQueryParams, customer: CustomerDocument): Promise<{
        data: ({
            metrics?: undefined;
            metricsMeta?: undefined;
            campaign?: undefined;
        } | {
            metrics: {
                date: string;
                events: {
                    type: string;
                    ref: string;
                    createdAt: string;
                    to: string;
                    from: string;
                }[];
                meta: {
                    [key: string]: number;
                };
            }[];
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
                id: import("mongoose").Types.ObjectId;
                name: string;
                segments: import("../../../internal/utils/cms/filters/cms.filter.builder").ResponseSegmentsType[];
                allSegments: boolean;
                status: import("@/campaigns/email-campaigns/campaigns/domain/types").CampaignStatus;
                startDate: Date;
                allowWeekend: boolean;
                contentId: number;
                createdAt: string | boolean;
                updatedAt: string | boolean;
            };
        })[];
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
    }>;
    enqueueEmailMetricsJob(options: CampaignMetricsExportParams, customer: CustomerDocument): Promise<boolean>;
}

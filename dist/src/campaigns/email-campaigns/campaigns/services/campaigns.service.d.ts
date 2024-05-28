import { Model, ObjectId, UpdateQuery } from 'mongoose';
import { CreateCampaignDto, UpdateCampaignDto, UpdateCampaignStatusDto } from '../dto/campaign.dto';
import { Campaign, CampaignDocument } from '../schemas/campaign.schema';
import { Paginator, PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { CampaignsMetrics, CampaignStatus } from '@/campaigns/email-campaigns/campaigns/domain/types';
import { ContentsService } from '@/campaigns/email-campaigns/contents/contents.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { SegmentsService } from '@/campaigns/email-campaigns/segments/segments.service';
import { CampaignHistoryDocument } from '@/campaigns/email-campaigns/campaigns/schemas/campaign-history.schema';
import { CampaignRepository } from '@/campaigns/email-campaigns/campaigns/repositories/campaign.repository';
import { SchemaId } from '@/internal/types/helpers';
import { EmailHistoryService } from '@/campaigns/email-campaigns/email-history/email-history.service';
import { TemplatesService } from '@/campaigns/email-campaigns/templates/templates.service';
import { AnalyticsService } from '@/legacy/dis/legacy/analytics/analytics.service';
import { AfyNotificationsService } from '@/integrations/afy-notifications/afy-notifications.service';
import { CampaignMetricsQueryParams } from '@/campaigns/email-campaigns/campaigns/dto/campaign-metrics-query-params.dto';
import { Queue } from 'bull';
import { CampaignMetricsExportParams } from '@/campaigns/email-campaigns/campaigns/dto/campaign-metrics-export-params.dto';
export declare class CampaignsService {
    private readonly campaignModel;
    private readonly campaignHistoryModel;
    private readonly contentsService;
    private readonly segmentsService;
    private readonly campaignRepository;
    private readonly emailHistoryService;
    private readonly templatesService;
    private readonly analyticsService;
    private readonly notificationsService;
    private csvUploaderQueue;
    constructor(campaignModel: Model<CampaignDocument>, campaignHistoryModel: Model<CampaignHistoryDocument>, contentsService: ContentsService, segmentsService: SegmentsService, campaignRepository: CampaignRepository, emailHistoryService: EmailHistoryService, templatesService: TemplatesService, analyticsService: AnalyticsService, notificationsService: AfyNotificationsService, csvUploaderQueue: Queue);
    getCampaigns(customer: CustomerDocument, page: number, perPage: number): Promise<PaginatorSchematicsInterface>;
    createCampaign(customer: CustomerDocument, dto: CreateCampaignDto): Promise<CampaignDocument>;
    update(id: SchemaId, dto: UpdateQuery<Partial<Campaign>>): Promise<CampaignDocument>;
    updateCampaign(id: SchemaId, dto: UpdateCampaignDto): Promise<CampaignDocument>;
    updateCampaignStatus(id: SchemaId, dto: UpdateCampaignStatusDto): Promise<CampaignDocument>;
    getCampaign(customer: CustomerDocument, id: SchemaId): Promise<{
        numberOfEmails: number;
        content: {
            emails: (import("../../../../cms/cms/types/email").Email | {
                id: number;
                name: string;
                usesRelativeTime: boolean;
                relativeDays: number;
                absoluteDay: number;
                absoluteMonth: number;
                templateName: string;
                image: any;
            })[];
            id: number;
            name: string;
            image: any;
        };
        id: import("mongoose").Types.ObjectId;
        name: string;
        allowWeekend: boolean;
        startDate: string;
        status: CampaignStatus;
        allSegments: boolean;
        segments: import("@/campaigns/email-campaigns/campaigns/domain/types").Segments;
        createdAt: string;
        contentId: number;
    }>;
    deleteCampaign(id: SchemaId): Promise<CampaignDocument>;
    getCustomerCampaignsByContent(customer: CustomerDocument, contentsId: Array<number>): Promise<Array<CampaignDocument>>;
    findByMessageId(messageId: string): Promise<CampaignDocument>;
    cancelCampaignsByTemplateId(templateId: number): Promise<void>;
    canBeChanged(campaignId: string): Promise<boolean>;
    getCampaignHistory(campaign: ObjectId): Promise<Array<CampaignHistoryDocument>>;
    getCampaignHistorySerialized(campaign: ObjectId): Promise<{
        id: import("mongoose").Types.ObjectId;
        campaignName: string;
        templateNames: string[];
        messageIds: string[];
        type: import("@/campaigns/email-campaigns/campaigns/domain/types").CampaignHistoryType;
        createdAt: Date;
    }[]>;
    private serializeHistory;
    getById(id: string): Promise<CampaignDocument>;
    getAllHistoryCampaigns(customer: CustomerDocument, page?: number, perPage?: number): Promise<PaginatorSchematicsInterface<CampaignHistoryDocument>>;
    getEmailCampaignMetrics(page: number, perPage: number, startDate: string, endDate: string): Promise<CampaignsMetrics>;
    findCampaignHistoryByMessageId(messageId: string): Promise<CampaignHistoryDocument | null>;
    getEmailCampaignMetricsForMember(customer: CustomerDocument, page: number, perPage: number, startDate: string, endDate: string): Promise<CampaignsMetrics>;
    getMetrics(options: CampaignMetricsQueryParams & Omit<Paginator, 'sortBy' | 'sortOrder'>, campaigns: CampaignDocument[]): Promise<{
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
                segments: import("../../../../internal/utils/cms/filters/cms.filter.builder").ResponseSegmentsType[];
                allSegments: boolean;
                status: CampaignStatus;
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
    emailMetrics(customer: CustomerDocument, options: CampaignMetricsQueryParams & Omit<Paginator, 'sortBy' | 'sortOrder'>): Promise<{
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
                segments: import("../../../../internal/utils/cms/filters/cms.filter.builder").ResponseSegmentsType[];
                allSegments: boolean;
                status: CampaignStatus;
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
    enqueueEmailMetricsJob(customer: CustomerDocument, options: CampaignMetricsExportParams): Promise<boolean>;
    private getEmailData;
    private getCampaignMetrics;
}

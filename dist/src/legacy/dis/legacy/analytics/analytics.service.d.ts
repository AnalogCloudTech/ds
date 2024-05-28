import { Logger } from '@nestjs/common';
import { Axios } from 'axios';
import { Client } from '@hubspot/api-client';
import { BookStatDto } from './dto/book-stat.dto';
import { LandingReportDto } from '@/legacy/dis/legacy/analytics/dto/landing-report.dto';
import { LeadsService } from '@/campaigns/email-campaigns/leads/leads.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
export declare class AnalyticsService {
    private readonly http;
    private readonly hubspot;
    private readonly logger;
    private readonly leadService;
    constructor(http: Axios, hubspot: Client, logger: Logger, leadService: LeadsService);
    getBookLeadsCount(startDate: string, endDate: string, customer: CustomerDocument): Promise<number>;
    getAllStats(startDate: string, endDate: string, customer: CustomerDocument, emails?: string[]): Promise<BookStatDto[]>;
    getEmailCampaignReports(emails: string[]): Promise<{
        campaignName: any;
        sent: any;
    }[]>;
    getOnDemandEmailReports(emails: string[]): Promise<{
        customerEmail: any;
        sent: any;
    }[]>;
    getEmailHistory(email: string): Promise<any[]>;
    getBookReads(startDate: string, endDate: string, emails?: string[], bookName?: string): Promise<number>;
    getBookVisits(startDate: string, endDate: string, emails?: string[], bookName?: string): Promise<number>;
    getBookLeads(emails: string[], pageNumber: number, pageSize: number, formatted?: boolean): Promise<any>;
    getBookLeadsReport(emails: string[]): Promise<string>;
    getLandingPageReports(filters: any): Promise<LandingReportDto[]>;
    getEmailHistoryByMessageIds(messageIds: Array<string>): Promise<any>;
    addLogs(logDetails: any): boolean;
    landingPageReportsDownload(): Promise<string>;
    clusterHealth(): Promise<import("axios").AxiosResponse<any, any>>;
}

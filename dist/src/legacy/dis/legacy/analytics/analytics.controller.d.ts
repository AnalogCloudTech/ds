import { AnalyticsService } from './analytics.service';
import { BookLeadDto } from './dto/book-lead.dto';
import { BookStatDto } from './dto/book-stat.dto';
import { Request as PlatformRequest, Response } from 'express';
import { LandingReportRequestDto } from './dto/landing-report.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getBookStats(startDate: string, endDate: string, customer: CustomerDocument): Promise<BookStatDto[]>;
    getBookLeads(email: string, pageNumber: number, pageSize?: number): Promise<BookLeadDto[]>;
    getBookLeadsCount(email: string, bookname?: string): Promise<number>;
    downloadLeads(email: string, res: Response): Promise<void>;
    getBookReads(email: string, bookname?: string): Promise<number>;
    getBookVisits(email: string, bookname?: string): Promise<number>;
    getLandingStats(): Promise<BookStatDto[]>;
    getLandingPageReports(filters: LandingReportRequestDto): Promise<import("./dto/landing-report.dto").LandingReportDto[]>;
    landingPageReportsDownload(res: Response): Promise<void>;
    getEmailCampaignReports(request: PlatformRequest): Promise<any>;
    getOnDemandEmailReports(request: PlatformRequest): Promise<any>;
    logDetails(logs: any): Promise<boolean>;
}

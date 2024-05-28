import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  Res,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { BookLeadDto } from './dto/book-lead.dto';
import { BookStatDto } from './dto/book-stat.dto';
import { Request as PlatformRequest, Response } from 'express';
import { LandingReportRequestDto } from './dto/landing-report.dto';
import { get } from 'lodash';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';

@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('book')
  async getBookStats(
    @Query('startDate') startDate = 'now-90d/d',
    @Query('endDate') endDate = 'now/d',
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ): Promise<BookStatDto[]> {
    const emails = await this.analyticsService.getEmailHistory(customer.email);
    return this.analyticsService.getAllStats(
      startDate,
      endDate,
      customer,
      emails,
    );
  }

  @Get('book/leads')
  async getBookLeads(
    @Query('email') email: string,
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize = 10,
  ): Promise<BookLeadDto[]> {
    const emails = await this.analyticsService.getEmailHistory(email);
    return this.analyticsService.getBookLeads(emails, pageNumber, pageSize);
  }

  @Get('book/leads/count')
  async getBookLeadsCount(
    @Query('email') email: string,
    @Query('bookname') bookname?: string,
  ) {
    return 0;
  }

  @Get('book/leads/download')
  async downloadLeads(
    @Query('email') email: string,
    @Res() res: Response,
  ): Promise<void> {
    const emails = await this.analyticsService.getEmailHistory(email);
    const report = await this.analyticsService.getBookLeadsReport(emails);
    res.type('csv');
    res.send(report);
  }

  @Get('book/reads')
  async getBookReads(
    @Query('email') email: string,
    @Query('bookname') bookname?: string,
  ) {
    return 0;
  }

  @Get('book/visits')
  async getBookVisits(
    @Query('email') email: string,
    @Query('bookname') bookname?: string,
  ) {
    return 0;
  }

  @Get('landing/stats')
  async getLandingStats(): Promise<BookStatDto[]> {
    return [
      {
        name: '',
        value: 0,
        description: '',
      },
    ];
  }

  @Get('landing/report')
  async getLandingPageReports(@Query() filters: LandingReportRequestDto) {
    return this.analyticsService.getLandingPageReports(filters);
  }

  @Get('landing/report/download')
  async landingPageReportsDownload(@Res() res: Response): Promise<void> {
    const report = await this.analyticsService.landingPageReportsDownload();
    res.type('csv');
    res.send(report);
  }

  @Get('email-campaigns')
  async getEmailCampaignReports(
    @Request() request: PlatformRequest,
  ): Promise<any> {
    const emails = get(request, ['user', 'identities']);
    return this.analyticsService.getEmailCampaignReports(emails);
  }

  @Get('on-demand-email')
  async getOnDemandEmailReports(
    @Request() request: PlatformRequest,
  ): Promise<any> {
    const emails = get(request, ['user', 'identities']);
    return this.analyticsService.getOnDemandEmailReports(emails);
  }

  @Post('log')
  async logDetails(@Body() logs: any) {
    return this.analyticsService.addLogs(logs);
  }
}

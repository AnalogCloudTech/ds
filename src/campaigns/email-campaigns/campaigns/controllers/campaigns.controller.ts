import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CampaignsService, SendCampaignsService } from '../services';
import {
  CreateCampaignDto,
  UpdateCampaignStatusDto,
} from '../dto/campaign.dto';
import { CustomerEmailTransformPipe } from '@/campaigns/email-campaigns/common/pipes/customer-email-transform.pipe';
import {
  Paginator,
  PaginatorSchematicsInterface,
  PaginatorTransformPipe,
} from '@/internal/utils/paginator';
import { ValidateSegmentsPipe } from '@/campaigns/email-campaigns/common/pipes/validate-segments.pipe';
import { Campaign } from '@/campaigns/email-campaigns/campaigns/domain/campaign';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CanBeChangedPipe } from '@/campaigns/email-campaigns/campaigns/pipes/can-be-changed.pipe';
import { ObjectId } from 'mongoose';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { CampaignHandler } from '@/campaigns/email-campaigns/campaigns/domain/types';
import { SchemaId } from '@/internal/types/helpers';
import DateRangeDTO from '@/internal/common/dtos/date-range.dto';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import { CampaignMetricsQueryParams } from '@/campaigns/email-campaigns/campaigns/dto/campaign-metrics-query-params.dto';
import { CampaignMetricsExportParams } from '@/campaigns/email-campaigns/campaigns/dto/campaign-metrics-export-params.dto';

@Controller({ path: 'email-campaigns/campaigns', version: '1' })
export class CampaignsController {
  constructor(
    private readonly service: CampaignsService,
    private readonly sendCampaignsService: SendCampaignsService,
  ) {}

  @Get()
  async getCampaigns(
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ): Promise<PaginatorSchematicsInterface> {
    return this.service.getCampaigns(customer, page, perPage);
  }

  @Get('campaigns-history')
  async getAllHistoryCampaigns(
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.service.getAllHistoryCampaigns(customer, page, perPage);
  }

  @Get(':id')
  async getCampaign(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Param('id') id: SchemaId,
  ): Promise<Campaign> {
    return this.service.getCampaign(customer, id);
  }

  @Serialize(Campaign)
  @Post()
  async createCampaign(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Body(ValidationPipe, CustomerEmailTransformPipe, ValidateSegmentsPipe)
    dto: CreateCampaignDto,
  ) {
    return this.service.createCampaign(customer, dto);
  }

  @Serialize(Campaign)
  @Post(':id/status')
  async updateStatus(
    @Body(ValidationPipe) dto: UpdateCampaignStatusDto,
    @Param('id', CanBeChangedPipe) id: SchemaId,
  ) {
    return this.service.updateCampaignStatus(id, dto);
  }

  @Post(':id')
  updateCampaign(
    @Body(ValidationPipe) body: CreateCampaignDto,
    @Param('id', CanBeChangedPipe) id: SchemaId,
  ) {
    return this.service.updateCampaign(id, body);
  }

  @Delete(':id')
  deleteCampaign(@Param('id') id: SchemaId) {
    return this.service.deleteCampaign(id);
  }

  @Get(':id/history')
  async getHistory(@Param('id') id: ObjectId) {
    return this.service.getCampaignHistorySerialized(id);
  }

  @Post(':id/force-send-active-campaigns')
  async forceSendCampaign(@Param('id') id: string) {
    const campaigns = [await this.service.getById(id)];
    console.time('handleCampaigns');

    console.time('sendAbsoluteCampaigns');
    await this.sendCampaignsService.sendAllCampaignsByHandler(
      campaigns,
      CampaignHandler.ABSOLUTE,
    );
    console.timeEnd('sendAbsoluteCampaigns');

    console.time('sendRelativeCampaigns');
    await this.sendCampaignsService.sendAllCampaignsByHandler(
      campaigns,
      CampaignHandler.RELATIVE,
    );
    console.timeEnd('sendRelativeCampaigns');

    console.timeEnd('handleCampaigns');
  }

  @Get('metrics/reports')
  @UsePipes(ValidationTransformPipe)
  async getEmailCampaignMetrics(
    @Query(PaginatorTransformPipe) { page, perPage }: Paginator,
    @Query() { startDate, endDate }: DateRangeDTO,
  ) {
    return this.service.getEmailCampaignMetrics(
      page,
      perPage,
      startDate,
      endDate,
    );
  }

  @Get('email-metrics/reports')
  @UsePipes(ValidationTransformPipe)
  getMemberEmailCampaignMetrics(
    @Query(PaginatorTransformPipe) { page, perPage }: Paginator,
    @Query() { startDate, endDate }: DateRangeDTO,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.service.getEmailCampaignMetricsForMember(
      customer,
      page,
      perPage,
      startDate,
      endDate,
    );
  }

  @Get('email/metrics')
  @UsePipes(ValidationTransformPipe)
  getMetrics(
    @Query(PaginatorTransformPipe) { page, perPage }: Paginator,
    @Query() options: CampaignMetricsQueryParams,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.service.emailMetrics(customer, {
      ...options,
      perPage,
      page,
    });
  }

  @Post('email/metrics-export')
  @UsePipes(ValidationTransformPipe)
  enqueueEmailMetricsJob(
    @Body() options: CampaignMetricsExportParams,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.service.enqueueEmailMetricsJob(customer, options);
  }

  @Get('email/total')
  countEmailsBySender(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.service.countEmailsBySender(customer.email);
  }
}

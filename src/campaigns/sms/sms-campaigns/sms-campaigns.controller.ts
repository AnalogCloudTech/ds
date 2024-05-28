import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { SmsCampaignsService } from './sms-campaigns.service';
import { CreateSmsCampaignDto } from './dto/create-sms-campaign.dto';
import { UpdateSmsCampaignDto } from './dto/update-sms-campaign.dto';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { FilterQuery } from 'mongoose';
import { SmsCampaignDocument } from '@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema';
import { Paginator, PaginatorTransformPipe } from '@/internal/utils/paginator';
import { SchemaId } from '@/internal/types/helpers';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';

@Controller({
  version: '1',
  path: 'sms-campaigns',
})
export class SmsCampaignsController {
  constructor(private readonly smsCampaignsService: SmsCampaignsService) {}

  @Post()
  create(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Body(ValidationPipe) createSmsCampaignDto: CreateSmsCampaignDto,
  ) {
    return this.smsCampaignsService.store(customer, createSmsCampaignDto);
  }

  @Get()
  findAll(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    paginator: Paginator,
    @Query() query: FilterQuery<SmsCampaignDocument> = {},
  ) {
    return this.smsCampaignsService.findAllPaginated(
      customer,
      paginator,
      query,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: SchemaId) {
    return this.smsCampaignsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: SchemaId,
    @Body() updateSmsCampaignDto: UpdateSmsCampaignDto,
  ) {
    return this.smsCampaignsService.update(id, updateSmsCampaignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: SchemaId) {
    return this.smsCampaignsService.remove(id);
  }
}

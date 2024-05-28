import {
  Paginator,
  PaginatorSchematicsInterface,
  PaginatorTransformPipe,
} from '@/internal/utils/paginator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';

import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { CampaingsService } from '../campaings.service';
import { CampaignDomain } from '../domain/campaigns.domain';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';

@Controller({ path: 'social-media/campaings', version: '1' })
export class CampaingsController {
  constructor(private readonly campaingsService: CampaingsService) {}

  @Serialize(CampaignDomain)
  @Post()
  create(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Body() createCampaingDto: CreateCampaignDto,
  ) {
    return this.campaingsService.create(customer, createCampaingDto);
  }

  @Serialize(CampaignDomain)
  @Get()
  findAllByCustomerId(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
  ): Promise<PaginatorSchematicsInterface> {
    return this.campaingsService.findAllByCustomerId(customer, page, perPage);
  }

  @Serialize(CampaignDomain)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaingsService.findOne(id);
  }

  @Serialize(CampaignDomain)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCampaingDto: UpdateCampaignDto,
  ) {
    return this.campaingsService.update(id, updateCampaingDto);
  }

  @Serialize(CampaignDomain)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaingsService.remove(id);
  }
}

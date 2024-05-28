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
import { ReferralMarketingService } from './referral-marketing.service';
import { CreateReferralMarketingDto } from './dto/create-referral-marketing.dto';
import { UpdateReferralMarketingDto } from './dto/update-referral-marketing.dto';
import {
  Paginator,
  PaginatorSchematicsInterface,
  PaginatorTransformPipe,
} from '@/internal/utils/paginator';
import { ReferralMarketingDomain } from './domain/referral-marketing-domain';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';

@Controller({ path: 'referral-marketing', version: '1' })
export class ReferralMarketingController {
  constructor(
    private readonly referralMarketingService: ReferralMarketingService,
  ) {}

  @Post()
  async create(
    @Body() createReferralMarketingDto: CreateReferralMarketingDto,
  ): Promise<ReferralMarketingDomain> {
    const referralMarketingCreated = await this.referralMarketingService.create(
      createReferralMarketingDto,
    );
    return {
      ...referralMarketingCreated.castTo(ReferralMarketingDomain),
      memberDetails: referralMarketingCreated.memberDetails,
      frontCover: referralMarketingCreated.frontCover,
      insideCover: referralMarketingCreated.insideCover,
      backInsideCoverTemplate: referralMarketingCreated.backInsideCoverTemplate,
      additionalCustomization: referralMarketingCreated.additionalCustomization,
      listingDetails: referralMarketingCreated.listingDetails,
    };
  }

  @Get()
  async findAll(
    @Query('status') status: string,
    @Query('sorting') sorting: string,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
  ): Promise<PaginatorSchematicsInterface> {
    const marketingDetails = await this.referralMarketingService.findAll(
      page,
      perPage,
      status,
      sorting,
    );
    return marketingDetails;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReferralMarketingDomain> {
    const marketingDetails = await this.referralMarketingService.findOne(id);
    return {
      ...marketingDetails.castTo(ReferralMarketingDomain),
      memberDetails: marketingDetails.memberDetails,
      frontCover: marketingDetails.frontCover,
      insideCover: marketingDetails.insideCover,
      backInsideCoverTemplate: marketingDetails.backInsideCoverTemplate,
      additionalCustomization: marketingDetails.additionalCustomization,
      listingDetails: marketingDetails.listingDetails,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReferralMarketingDto: UpdateReferralMarketingDto,
  ): Promise<ReferralMarketingDomain> {
    const updated = await this.referralMarketingService.update(
      id,
      updateReferralMarketingDto,
    );
    return updated.castTo(ReferralMarketingDomain);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.referralMarketingService.remove(id);
    return result.castTo(ReferralMarketingDomain);
  }
}

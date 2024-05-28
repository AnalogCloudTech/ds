import { Controller, Get, Param } from '@nestjs/common';
import { ContentsService } from '@/campaigns/email-campaigns/contents/contents.service';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';

@Controller({ path: 'email-campaigns/content', version: '1' })
export class ContentsController {
  constructor(private readonly service: ContentsService) {}

  @Get()
  async index(@Param(CustomerPipeByIdentities) customer: CustomerDocument) {
    return this.service.findAllWithCustomerCampaignId(customer);
  }

  @Get(':contentId')
  async details(@Param('contentId') contentId: number) {
    return this.service.details(contentId);
  }
}

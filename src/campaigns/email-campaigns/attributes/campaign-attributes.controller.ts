import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { CreateAttributesDto } from '@/customers/customers/dto/attributesDto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CampaignAttributesService } from './campaign-attributes.service';
import { EmailLowerCasePipe } from '@/internal/common/pipes/email-lower-case.pipe';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';

@Controller({ path: 'email-campaigns/attributes', version: '1' })
export class CampaignAttributesController {
  constructor(
    private readonly attributesService: CampaignAttributesService,
    private readonly sesService: SesService,
  ) {}

  @Post()
  async create(
    @Body(EmailLowerCasePipe) createAttributeDto: CreateAttributesDto,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    await this.attributesService.create(customer.id, createAttributeDto);
  }

  @Get()
  findOne(@Param(CustomerPipeByIdentities) customer: CustomerDocument) {
    return this.attributesService.findOne(customer.id);
  }

  @Delete()
  async remove(@Param(CustomerPipeByIdentities) customer: CustomerDocument) {
    await this.attributesService.remove(customer.id);
  }

  @Post('verify')
  verifyEmail(@Body('email') email: string) {
    return this.sesService.sendVerificationEmail(email);
  }

  @Post('isverified')
  emailIsVerified(@Body('email') email: string) {
    return this.sesService.emailIsVerified(email);
  }
}

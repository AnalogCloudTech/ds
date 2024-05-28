import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { inspect } from 'util';
import { TemplatesService } from '@/campaigns/email-campaigns/templates/templates.service';
import { Event } from '@/cms/cms/types/webhook';
import { Paginator, PaginatorTransformPipe } from '@/internal/utils/paginator';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { TemplateDetails } from '@/cms/cms/types/template';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';

@Controller({ path: 'email-campaigns/templates', version: '1' })
export class TemplatesController {
  constructor(
    private readonly templatesService: TemplatesService,
    private readonly logger: Logger,
  ) {}

  @Post()
  public async webhook(@Body(ValidationPipe) event: Event) {
    this.logger.log(`Received webhook: ${inspect(event)}`);
    return this.templatesService.handleCmsWebhook(event);
  }

  @Serialize(TemplateDetails)
  @Get()
  public list(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    paginator: Paginator,
  ) {
    return this.templatesService.list(customer, paginator);
  }

  @Get('dropdown/list')
  public listDropDown() {
    return this.templatesService.listDropdown();
  }

  @Get(':id')
  public async show(@Param('id') templateId: number) {
    return this.templatesService.templateDetails(templateId);
  }
}

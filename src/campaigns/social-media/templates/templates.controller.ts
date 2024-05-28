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
import { TemplatesService } from '@/campaigns/social-media/templates/templates.service';
import { Event } from '@/cms/cms/types/webhook';
import { QueryParams } from '@/cms/cms/types/common';
import { Paginator } from '@/internal/utils/paginator';

@Controller({ path: 'social-media/templates', version: '1' })
export class TemplatesController {
  constructor(
    private readonly templatesService: TemplatesService,
    private readonly logger: Logger,
  ) {}

  @Post()
  public async webhook(@Body(ValidationPipe) event: Event): Promise<void> {
    this.logger.log(`Received webhook: ${inspect(event)}`);
    return this.templatesService.handleCmsWebhook(event);
  }

  @Get(':id')
  public async show(@Param('id') templateId: number) {
    return this.templatesService.templateDetails(templateId);
  }

  @Get()
  public async list(@Query() { page, perPage: pageSize }: Paginator) {
    const query: QueryParams = {
      pagination: {
        page,
        pageSize,
      },
    };
    return this.templatesService.list(query);
  }
}

import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { SmsTemplatesService } from './sms-templates.service';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { SmsTemplateDomain } from '@/campaigns/sms/sms-templates/domain/sms-template';
import { QueryParams } from '@/cms/cms/types/common';

@Controller({
  version: '1',
  path: 'sms-templates',
})
export class SmsTemplatesController {
  constructor(private readonly smsTemplatesService: SmsTemplatesService) {}

  @Serialize(SmsTemplateDomain)
  @Get()
  async findAll(@Query() query: QueryParams) {
    return this.smsTemplatesService.findAllPaginated(query);
  }

  @Serialize(SmsTemplateDomain)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const template = await this.smsTemplatesService.findById(id);

    if (!template) {
      throw new NotFoundException(template, 'template not found');
    }

    return template;
  }
}

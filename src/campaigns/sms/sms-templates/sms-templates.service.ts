import { Inject, Injectable } from '@nestjs/common';
import { Axios } from 'axios';
import { SmsTemplatesRepository } from '@/campaigns/sms/sms-templates/sms-templates.repository';
import { SmsTemplate } from '@/campaigns/sms/sms-templates/domain/types';
import { QueryParams } from '@/cms/cms/types/common';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { buildCmsPagination } from '@/cms/cms/helpers/build-cms-pagination';
import { flattenCmsObject } from '@/cms/cms/helpers/flatten-cms-object';

@Injectable()
export class SmsTemplatesService {
  protected readonly repository: SmsTemplatesRepository;
  constructor(@Inject('HTTP_CMS') private readonly http: Axios) {
    this.repository = new SmsTemplatesRepository(http);
  }

  async findById(id: number): Promise<SmsTemplate | null> {
    const template = await this.repository.findById(id);
    return template ? flattenCmsObject<SmsTemplate>(template) : null;
  }

  async findByKey(key: string): Promise<SmsTemplate | null> {
    const queryParams = <QueryParams>{
      filters: {
        key,
      },
    };
    try {
      const template = await this.repository.first(queryParams);
      return template ? flattenCmsObject<SmsTemplate>(template) : null;
    } catch (error) {
      // @TODO fix that at AFY-5634
      return null;
    }
  }

  async findAllPaginated(
    query?: QueryParams,
  ): Promise<PaginatorSchematicsInterface<SmsTemplate>> {
    const response = await this.repository.findAllPaginated(query);
    return buildCmsPagination<SmsTemplate>(response);
  }
}

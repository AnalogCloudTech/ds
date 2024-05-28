import { GenericRepository } from '@/cms/cms/repository/generic.repository';
import { SmsTemplate } from '@/campaigns/sms/sms-templates/domain/types';

export class SmsTemplatesRepository extends GenericRepository<SmsTemplate> {
  protected baseRoute = 'sms-templates';
}

import { Axios } from 'axios';
import { SmsTemplatesRepository } from '@/campaigns/sms/sms-templates/sms-templates.repository';
import { SmsTemplate } from '@/campaigns/sms/sms-templates/domain/types';
import { QueryParams } from '@/cms/cms/types/common';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
export declare class SmsTemplatesService {
    private readonly http;
    protected readonly repository: SmsTemplatesRepository;
    constructor(http: Axios);
    findById(id: number): Promise<SmsTemplate | null>;
    findByKey(key: string): Promise<SmsTemplate | null>;
    findAllPaginated(query?: QueryParams): Promise<PaginatorSchematicsInterface<SmsTemplate>>;
}

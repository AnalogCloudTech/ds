import { SmsTemplatesService } from './sms-templates.service';
import { QueryParams } from '@/cms/cms/types/common';
export declare class SmsTemplatesController {
    private readonly smsTemplatesService;
    constructor(smsTemplatesService: SmsTemplatesService);
    findAll(query: QueryParams): Promise<import("../../../internal/utils/paginator").PaginatorSchematicsInterface<import("./domain/types").SmsTemplate>>;
    findOne(id: number): Promise<import("./domain/types").SmsTemplate>;
}

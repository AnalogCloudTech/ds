import { SmsCampaignsService } from '@/campaigns/sms/sms-campaigns/sms-campaigns.service';
import { SmsTemplatesService } from '@/campaigns/sms/sms-templates/sms-templates.service';
export declare class SmsCampaignsScheduler {
    private readonly service;
    private readonly smsTemplatesService;
    constructor(service: SmsCampaignsService, smsTemplatesService: SmsTemplatesService);
    handler(): Promise<void>;
}

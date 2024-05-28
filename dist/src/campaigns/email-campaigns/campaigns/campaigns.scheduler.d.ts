import { Logger } from '@nestjs/common';
import { SendCampaignsService } from '@/campaigns/email-campaigns/campaigns/services';
export declare class CampaignsScheduler {
    private readonly service;
    private readonly logger;
    constructor(service: SendCampaignsService, logger: Logger);
    handleCampaigns(): Promise<void>;
}

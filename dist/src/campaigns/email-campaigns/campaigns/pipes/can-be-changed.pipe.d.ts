import { PipeTransform } from '@nestjs/common';
import { CampaignsService } from '@/campaigns/email-campaigns/campaigns/services';
export declare class CanBeChangedPipe implements PipeTransform {
    private readonly campaignsService;
    constructor(campaignsService: CampaignsService);
    transform(campaignId: string): Promise<string>;
}

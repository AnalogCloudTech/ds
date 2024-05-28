import { ForbiddenException, Inject, PipeTransform } from '@nestjs/common';
import { CampaignsService } from '@/campaigns/email-campaigns/campaigns/services';
import { CampaignStatus } from '@/campaigns/email-campaigns/campaigns/domain/types';

export class CanBeChangedPipe implements PipeTransform {
  constructor(
    @Inject(CampaignsService)
    private readonly campaignsService: CampaignsService,
  ) {}

  async transform(campaignId: string): Promise<string> {
    const canBeChanged = await this.campaignsService.canBeChanged(campaignId);

    if (!canBeChanged) {
      throw new ForbiddenException(
        `This record can only be changed if the status is different from "${CampaignStatus.CANCELED}"`,
      );
    }

    return campaignId;
  }
}

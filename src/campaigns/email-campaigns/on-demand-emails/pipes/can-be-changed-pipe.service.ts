import { ForbiddenException, Injectable, PipeTransform } from '@nestjs/common';
import { OnDemandEmailsService } from '@/campaigns/email-campaigns/on-demand-emails/on-demand-emails.service';
import { Statuses } from '@/campaigns/email-campaigns/on-demand-emails/domain/types';

@Injectable()
export class CanBeChangedPipe implements PipeTransform {
  constructor(private readonly service: OnDemandEmailsService) {}

  async transform(onDemandEmailId: string): Promise<string> {
    const canBeChanged = await this.service.canBeChanged(onDemandEmailId);
    if (!canBeChanged) {
      throw new ForbiddenException(
        `This record only can be changed if status is equal to "${Statuses.STATUS_SCHEDULED}"`,
      );
    }

    return onDemandEmailId;
  }
}

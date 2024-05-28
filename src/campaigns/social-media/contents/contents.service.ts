import { Injectable } from '@nestjs/common';
import { CmsService } from '@/cms/cms/cms.service';
import { PublicationState, QueryParams } from '@/cms/cms/types/common';

@Injectable()
export class ContentsService {
  constructor(private readonly cmsService: CmsService) {}

  async list(query?: QueryParams) {
    query = <QueryParams>{
      populate: ['CampaignPost', 'image'],
      publicationState: PublicationState.LIVE,
      ...query,
    };
    return this.cmsService.socialMediaContentsList(query);
  }

  async details(contentId: number) {
    return this.cmsService.socialMediaContentsDetails(contentId);
  }
}

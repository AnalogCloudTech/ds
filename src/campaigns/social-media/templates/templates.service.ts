import { Injectable } from '@nestjs/common';
import { CmsService } from '@/cms/cms/cms.service';
import { PublicationState, QueryParams } from '@/cms/cms/types/common';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { buildTemplateName } from '@/internal/libs/aws/ses/constants';
import { Event, EventType } from '@/cms/cms/types/webhook';

@Injectable()
export class TemplatesService {
  constructor(
    private readonly cmsService: CmsService,
    private readonly sesService: SesService,
  ) {}

  async list(query?: QueryParams) {
    query = {
      ...query,
      publicationState: PublicationState.LIVE,
    };
    return this.cmsService.socialTemplatesList(query);
  }

  async templateDetails(templateId: number) {
    const query: QueryParams = {
      publicationState: PublicationState.LIVE,
      populate: '*',
    };
    return this.cmsService.socialMediaTemplateDetails(templateId, query);
  }

  async handleCmsWebhook(event: Event): Promise<any> {
    if (event.model !== 'social-media-template') {
      return;
    }
    const templateId = buildTemplateName(event.entry.id);
    switch (event.event) {
      case EventType.ENTRY_UPDATE:
        return this.sesService.updateTemplate(
          templateId,
          event.entry.subject,
          event.entry.content,
        );
      case EventType.ENTRY_CREATE:
        return this.sesService.createTemplate(
          templateId,
          event.entry.subject,
          event.entry.content,
        );
      case EventType.ENTRY_DELETE:
        return this.sesService.deleteTemplate(templateId);
    }
  }
}

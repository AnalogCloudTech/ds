import { Injectable } from '@nestjs/common';
import { CmsService } from '@/cms/cms/cms.service';
import { PublicationState, QueryParams } from '@/cms/cms/types/common';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import {
  buildCustomerTemplateName,
  buildTemplateName,
} from '@/internal/libs/aws/ses/constants';
import {
  Event,
  EventType,
  Models,
  SESTemplateResponse,
} from '@/cms/cms/types/webhook';
import { CampaignsService } from '@/campaigns/email-campaigns/campaigns/services';
import {
  Paginator,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import {
  CmsFilterBuilder,
  CmsFilterObject,
} from '@/internal/utils/cms/filters/cms.filter.builder';
import { CmsPopulateBuilder } from '@/internal/utils/cms/populate/cms.populate.builder';
import { Template, TemplateDetails } from '@/cms/cms/types/template';
import { isEmpty } from 'lodash';
import { CustomerTemplatesService } from '@/campaigns/email-campaigns/customer-templates/customer-templates.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';

@Injectable()
export class TemplatesService {
  constructor(
    private readonly cmsService: CmsService,
    private readonly sesService: SesService,
    private readonly campaignsService: CampaignsService,
    private readonly customerTemplatesService: CustomerTemplatesService,
  ) {}

  public async list(
    customer: CustomerDocument,
    { page, perPage }: Paginator,
  ): Promise<PaginatorSchematicsInterface<TemplateDetails>> {
    const query: QueryParams = {
      populate: {
        emailTemplates: {
          filters: {
            customerId: {
              $eq: customer._id.toString(),
            },
          },
        },
      },
      pagination: {
        page,
        pageSize: perPage,
      },
    };

    const filters = [
      <CmsFilterObject>{
        name: 'customerId',
        operator: '$null',
        value: true,
      },
    ];

    const url = CmsPopulateBuilder.build({
      ...query,
      publicationState: PublicationState.LIVE,
    });
    const queryFilters = CmsFilterBuilder.build(filters);
    const fullQuery = `?${url}&${queryFilters}`;

    const list = await this.cmsService.templateListWithPagination<Template>(
      fullQuery,
    );

    const customerTemplateIds: Array<number> = [];
    list.data = list.data.map((template: Template) => {
      if (isEmpty(template.emailTemplates?.data)) {
        return template;
      } else {
        const [templateData] = template.emailTemplates.data;
        const { id, attributes } = templateData;
        customerTemplateIds.push(id);
        return <TemplateDetails>{
          ...template,
          customTemplate: <TemplateDetails>{
            id,
            ...attributes,
          },
        };
      }
    });

    if (customerTemplateIds.length) {
      const customerTemplates =
        await this.customerTemplatesService.findAllByCustomer(
          customer,
          0,
          customerTemplateIds.length,
        );

      list.data = list.data.map((template: TemplateDetails) => {
        if (isEmpty(template.customTemplate)) {
          return template;
        } else {
          const { _id } = customerTemplates.find((customerTemplate) => {
            return customerTemplate.templateId === template.customTemplate.id;
          });
          template.customTemplate.customerTemplateId = _id.toString();
          return template;
        }
      });
    }

    return list;
  }

  public listDropdown() {
    return this.cmsService.templateListDropdown();
  }

  public async templateDetails(templateId: number) {
    const query: QueryParams = {
      publicationState: PublicationState.LIVE,
      populate: '*',
    };
    return this.cmsService.templateDetails(templateId, query);
  }

  public async handleCmsWebhook(
    event: Event<TemplateDetails>,
  ): Promise<SESTemplateResponse> {
    if (event.model !== Models.EMAIL_TEMPLATE) {
      return;
    }
    const templateId = event.entry.customerId
      ? buildCustomerTemplateName(event.entry.id)
      : buildTemplateName(event.entry.id);

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
        return this.deleteTemplate(templateId, event.entry.id);
      default:
        return null;
    }
  }

  public async deleteTemplate(templateName: string, templateId: number) {
    await this.campaignsService.cancelCampaignsByTemplateId(templateId);
    return this.sesService.deleteTemplate(templateName);
  }
}

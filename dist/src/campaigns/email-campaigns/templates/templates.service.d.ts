import { CmsService } from '@/cms/cms/cms.service';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { Event, SESTemplateResponse } from '@/cms/cms/types/webhook';
import { CampaignsService } from '@/campaigns/email-campaigns/campaigns/services';
import { Paginator, PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { Template, TemplateDetails } from '@/cms/cms/types/template';
import { CustomerTemplatesService } from '@/campaigns/email-campaigns/customer-templates/customer-templates.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
export declare class TemplatesService {
    private readonly cmsService;
    private readonly sesService;
    private readonly campaignsService;
    private readonly customerTemplatesService;
    constructor(cmsService: CmsService, sesService: SesService, campaignsService: CampaignsService, customerTemplatesService: CustomerTemplatesService);
    list(customer: CustomerDocument, { page, perPage }: Paginator): Promise<PaginatorSchematicsInterface<TemplateDetails>>;
    listDropdown(): Promise<Template[]>;
    templateDetails(templateId: number): Promise<TemplateDetails>;
    handleCmsWebhook(event: Event<TemplateDetails>): Promise<SESTemplateResponse>;
    deleteTemplate(templateName: string, templateId: number): Promise<import("aws-sdk/lib/request").PromiseResult<import("aws-sdk/clients/ses").DeleteTemplateResponse, import("aws-sdk").AWSError>>;
}

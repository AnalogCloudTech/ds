import { Logger } from '@nestjs/common';
import { TemplatesService } from '@/campaigns/email-campaigns/templates/templates.service';
import { Event } from '@/cms/cms/types/webhook';
import { Paginator } from '@/internal/utils/paginator';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { TemplateDetails } from '@/cms/cms/types/template';
export declare class TemplatesController {
    private readonly templatesService;
    private readonly logger;
    constructor(templatesService: TemplatesService, logger: Logger);
    webhook(event: Event): Promise<import("@/cms/cms/types/webhook").SESTemplateResponse>;
    list(customer: CustomerDocument, paginator: Paginator): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<TemplateDetails>>;
    listDropDown(): Promise<import("@/cms/cms/types/template").Template[]>;
    show(templateId: number): Promise<TemplateDetails>;
}

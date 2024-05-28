import { Logger } from '@nestjs/common';
import { TemplatesService } from '@/campaigns/social-media/templates/templates.service';
import { Event } from '@/cms/cms/types/webhook';
import { Paginator } from '@/internal/utils/paginator';
export declare class TemplatesController {
    private readonly templatesService;
    private readonly logger;
    constructor(templatesService: TemplatesService, logger: Logger);
    webhook(event: Event): Promise<void>;
    show(templateId: number): Promise<{
        imageUrl: any;
        socialMedia: any;
        name: string;
        content: string;
        createdAt: string;
        subject: string;
        customerId?: string;
        bodyContent: string;
        templateTitle: string;
    }>;
    list({ page, perPage: pageSize }: Paginator): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<any>>;
}

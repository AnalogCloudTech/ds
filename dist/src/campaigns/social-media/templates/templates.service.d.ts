import { CmsService } from '@/cms/cms/cms.service';
import { QueryParams } from '@/cms/cms/types/common';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { Event } from '@/cms/cms/types/webhook';
export declare class TemplatesService {
    private readonly cmsService;
    private readonly sesService;
    constructor(cmsService: CmsService, sesService: SesService);
    list(query?: QueryParams): Promise<import("../../../internal/utils/paginator").PaginatorSchematicsInterface<any>>;
    templateDetails(templateId: number): Promise<{
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
    handleCmsWebhook(event: Event): Promise<any>;
}

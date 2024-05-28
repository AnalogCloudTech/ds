import { CmsService } from '@/cms/cms/cms.service';
import { QueryParams } from '@/cms/cms/types/common';
export declare class ContentsService {
    private readonly cmsService;
    constructor(cmsService: CmsService);
    list(query?: QueryParams): Promise<import("../../../internal/utils/paginator").PaginatorSchematicsInterface<any>>;
    details(contentId: number): Promise<{
        id: number;
        name: any;
        image: any;
        campaignPost: {
            id: any;
            name: any;
            relativeDays: any;
            absoluteDay: any;
            absoluteMonth: any;
            content: any;
            templateName: any;
            image: any;
            socialMedia: any;
        }[];
    }>;
}

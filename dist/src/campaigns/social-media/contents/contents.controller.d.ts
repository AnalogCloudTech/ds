import { ContentsService } from '@/campaigns/social-media/contents/contents.service';
import { Paginator } from '@/internal/utils/paginator';
export declare class ContentsController {
    private readonly contentsServiceService;
    constructor(contentsServiceService: ContentsService);
    show(contentId: number): Promise<{
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
    list({ page, perPage: pageSize }: Paginator): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<any>>;
}

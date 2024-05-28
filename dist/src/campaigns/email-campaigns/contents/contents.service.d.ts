import { CmsService } from '@/cms/cms/cms.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CampaignsService } from '@/campaigns/email-campaigns/campaigns/services/campaigns.service';
import { DataObject } from '@/cms/cms/types/common';
import { Content } from '@/cms/cms/types/content';
import { Email } from '@/cms/cms/types/email';
export declare class ContentsService {
    private readonly cmsService;
    private readonly campaignsService;
    constructor(cmsService: CmsService, campaignsService: CampaignsService);
    findAll(): Promise<Array<any>>;
    findAllWithCustomerCampaignId(customer: CustomerDocument): Promise<Array<object>>;
    details(id: number): Promise<{
        emails: (Email | {
            id: number;
            name: string;
            usesRelativeTime: boolean;
            relativeDays: number;
            absoluteDay: number;
            absoluteMonth: number;
            templateName: string;
            image: any;
        })[];
        id: number;
        name: string;
        image: any;
    }>;
    detailsRaw(id: number): Promise<DataObject<Content>>;
}

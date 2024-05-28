import { ContentsService } from '@/campaigns/email-campaigns/contents/contents.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
export declare class ContentsController {
    private readonly service;
    constructor(service: ContentsService);
    index(customer: CustomerDocument): Promise<object[]>;
    details(contentId: number): Promise<{
        emails: (import("../../../cms/cms/types/email").Email | {
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
}

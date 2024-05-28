import { Logger } from '@nestjs/common';
import { SegmentsService } from '@/campaigns/email-campaigns/segments/segments.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Event } from '@/cms/cms/types/webhook';
export declare class SegmentsController {
    private readonly service;
    private readonly logger;
    constructor(service: SegmentsService, logger: Logger);
    index(request: any): Promise<import("./domain/segment").Segment[]>;
    withLeadsCount(request: any, customer: CustomerDocument): Promise<{
        leads: import("mongoose").Types.ObjectId[];
        id: number;
        name: string;
    }[]>;
    webhook(event: Event): Promise<any>;
}

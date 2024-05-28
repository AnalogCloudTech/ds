import { CmsService } from '@/cms/cms/cms.service';
import { SegmentQueryFilters, SegmentQueryFiltersById } from '@/campaigns/email-campaigns/segments/types';
import { ResponseSegmentsType } from '@/internal/utils/cms/filters/cms.filter.builder';
import { LeadsService } from '@/campaigns/email-campaigns/leads/leads.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Document } from 'mongoose';
import { Event } from '@/cms/cms/types/webhook';
import { Segment } from '@/campaigns/email-campaigns/segments/domain/segment';
import { Segments } from '@/campaigns/email-campaigns/campaigns/domain/types';
export declare class SegmentsService {
    private readonly cmsService;
    private readonly leadsService;
    constructor(cmsService: CmsService, leadsService: LeadsService);
    list(queryFilter: SegmentQueryFilters): Promise<Array<Segment>>;
    listById(queryFilter: SegmentQueryFiltersById): Promise<Array<ResponseSegmentsType>>;
    attachSegments<ItemT = any, ReturnT = any>(listT: Array<ItemT & Document & {
        segments: Segments;
    }>, segmentsId: Array<number>): Promise<Array<ReturnT>>;
    listWithCustomerLeadsCount(customer: CustomerDocument, filters: SegmentQueryFilters): Promise<{
        leads: import("mongoose").Types.ObjectId[];
        id: number;
        name: string;
    }[]>;
    handleWebhook(event: Event): Promise<any>;
}

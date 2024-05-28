/// <reference types="mongoose" />
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CreateLeadFromPagesteadDto } from './dto/create-lead-from-pagestead.dto';
import { ImportLeadDto } from '@/campaigns/email-campaigns/leads/dto/import-lead.dto';
import { Paginator, PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { Response } from 'express';
import { Sortable } from '@/internal/utils/sortable/sortable';
import { LeadsSortableFields } from '@/internal/utils/sortable/leads-sortable-fields';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { LeadDocument } from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
import { LeadsFiltersDTO } from '@/campaigns/email-campaigns/leads/dto/leads-filters.dto';
import { UnsubscribeLeadDTO } from '@/campaigns/email-campaigns/leads/dto/unsubscribe-lead.dto';
import { BulkDeleteLeadsDto } from '@/campaigns/email-campaigns/leads/dto/bulk-delete-leads.dto';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    findAll(req: any, customer: CustomerDocument, { page, perPage }: Paginator, filters: LeadsFiltersDTO, { sort }: Sortable<LeadsSortableFields>): Promise<PaginatorSchematicsInterface>;
    create(req: any, customer: CustomerDocument, dto: CreateLeadDto): Promise<import("mongoose").Document<unknown, any, import("@/campaigns/email-campaigns/leads/schemas/lead.schema").Lead> & import("@/campaigns/email-campaigns/leads/schemas/lead.schema").Lead & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createLandingPage(req: any, dto: CreateLeadDto): Promise<import("mongoose").Document<unknown, any, import("@/campaigns/email-campaigns/leads/schemas/lead.schema").Lead> & import("@/campaigns/email-campaigns/leads/schemas/lead.schema").Lead & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createFromPagestead(createLeadFromPagesteadDto: CreateLeadFromPagesteadDto): Promise<import("mongoose").Document<unknown, any, import("@/campaigns/email-campaigns/leads/schemas/lead.schema").Lead> & import("@/campaigns/email-campaigns/leads/schemas/lead.schema").Lead & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(req: any, customer: CustomerDocument, id: string, updateLeadDto: UpdateLeadDto): Promise<import("@/campaigns/email-campaigns/leads/schemas/lead.schema").Lead>;
    removeBulk(dto: BulkDeleteLeadsDto, customer: CustomerDocument): Promise<boolean>;
    remove(req: any, customer: CustomerDocument, id: string): Promise<boolean>;
    importList(dto: ImportLeadDto, customer: CustomerDocument): Promise<import("./domain/types").ImportLeadsFromFile>;
    downloadLeads(req: any, customer: CustomerDocument, res: Response): Promise<Response<any, Record<string, any>>>;
    unsubscribe(dto: UnsubscribeLeadDTO): Promise<LeadDocument | null>;
}

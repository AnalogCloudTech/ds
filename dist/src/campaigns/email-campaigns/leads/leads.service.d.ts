import { Lead, LeadDocument } from './schemas/lead.schema';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ImportLeadDto } from '@/campaigns/email-campaigns/leads/dto/import-lead.dto';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { ImportLeadsFromFile, UsageFields } from '@/campaigns/email-campaigns/leads/domain/types';
import { SegmentsService } from '@/campaigns/email-campaigns/segments/segments.service';
import { SortableFields } from '@/internal/utils/sortable/sortable';
import { LeadsSortableFields } from '@/internal/utils/sortable/leads-sortable-fields';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CustomersService } from '@/customers/customers/customers.service';
import { CreateLeadFromPagesteadDto } from '@/campaigns/email-campaigns/leads/dto/create-lead-from-pagestead.dto';
import { SchemaId } from '@/internal/types/helpers';
import { CreateUserDto } from '@/campaigns/email-campaigns/leads/dto/create-user.dto';
import { LeadsFiltersDTO } from '@/campaigns/email-campaigns/leads/dto/leads-filters.dto';
import { BulkDeleteLeadsDto } from '@/campaigns/email-campaigns/leads/dto/bulk-delete-leads.dto';
export declare class LeadsService {
    private readonly leadModel;
    private readonly segmentsService;
    private readonly customersService;
    constructor(leadModel: Model<LeadDocument>, segmentsService: SegmentsService, customersService: CustomersService);
    findAll(user: any): Promise<LeadDocument[]>;
    findAllLeadsByMemberEmailId(email: string): Promise<LeadDocument[]>;
    findAllPaginated(identities: string[], customer: CustomerDocument, page: number, perPage: number, filters?: LeadsFiltersDTO, sort?: SortableFields<LeadsSortableFields>): Promise<PaginatorSchematicsInterface>;
    getLastCreatedLeadByCustomerId(customerId: SchemaId): Promise<LeadDocument>;
    findAllWithSegments(user: any, customer: CustomerDocument): Promise<any[]>;
    create(createLeadDto: CreateLeadDto, customer?: CustomerDocument): Promise<LeadDocument>;
    findUserLead(customer: CustomerDocument, identities: [], id: string): Promise<LeadDocument>;
    update(id: SchemaId, updateLeadDto: UpdateLeadDto): Promise<Lead>;
    updateMany(filter: FilterQuery<LeadDocument>, data: UpdateQuery<LeadDocument>): Promise<Array<LeadDocument>>;
    updateUserLead(customer: CustomerDocument, identities: [], id: any, updateLeadDto: UpdateLeadDto): Promise<Lead>;
    private remove;
    private removeBulk;
    removeUserLead(customer: CustomerDocument, identities: [], id: string): Promise<boolean>;
    bulkRemoveCustomerLeads(customer: CustomerDocument, dto: BulkDeleteLeadsDto): Promise<boolean>;
    batchStoreFromFile(dto: ImportLeadDto, customer: CustomerDocument): Promise<ImportLeadsFromFile>;
    getAllFromFilter(filter: FilterQuery<LeadDocument>, lastUsageFilter?: UsageFields): Promise<LeadDocument[]>;
    unsubscribe(id: SchemaId): Promise<LeadDocument>;
    findLeadsByEmail(email: string): Promise<Array<LeadDocument>>;
    removeSegmentFromLeads(segmentId: number): Promise<any>;
    setLeadsUsage(leads: Array<Lead>, field: UsageFields): Promise<any[]>;
    exportLeads(user: CreateUserDto, customer: CustomerDocument): Promise<string>;
    getLeadCountByEmail(startDate: string, endDate: string, email: string, customer: CustomerDocument): Promise<number>;
    fillWithInheritanceData(email: any, dto: CreateLeadDto | CreateLeadFromPagesteadDto): Promise<CreateLeadDto | CreateLeadFromPagesteadDto>;
    createFromPagestead(dto: CreateLeadFromPagesteadDto): Promise<LeadDocument>;
    find(filter: FilterQuery<LeadDocument>): Promise<(import("mongoose").Document<unknown, any, Lead> & Lead & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findCustomerDuplicatedLeads(customer: CustomerDocument, email: string, identities?: Array<string>): Promise<(import("mongoose").Document<unknown, any, Lead> & Lead & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    private removeDuplicatedLeads;
    private removeTodayUsedLeads;
}

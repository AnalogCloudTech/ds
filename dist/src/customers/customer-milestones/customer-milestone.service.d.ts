import { Logger } from '@nestjs/common';
import { CustomersService } from '@/customers/customers/customers.service';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { SchemaId } from '@/internal/types/helpers';
import { CustomerMilestoneDocument } from './schema/customer-milestone.schema';
import { LeadsService } from '@/campaigns/email-campaigns/leads/leads.service';
import { CustomersMilestoneRepository } from './repository/customers-milestone-repository';
import { FilterQuery, QueryOptions } from 'mongoose';
import { LeadDocument } from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
export declare class CustomerMilestoneService {
    private customerService;
    private readonly customerMilestoneRepository;
    private readonly hubspotService;
    private readonly leadsService;
    private readonly logger;
    constructor(customerService: CustomersService, customerMilestoneRepository: CustomersMilestoneRepository, hubspotService: HubspotService, leadsService: LeadsService, logger: Logger);
    findAll(filter?: FilterQuery<CustomerMilestoneDocument>, options?: QueryOptions, page?: number, perPage?: number): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<import("./domain/types").CustomerMilestonesDto>>;
    customerMilestone(): Promise<void>;
    updateCustomerProfileImage(customerId: SchemaId, hubspotCustomerProfileImage: string, customerLastModifiedDate: string): Promise<CustomerMilestoneDocument>;
    updateCustomerLastLogin(customerId: SchemaId, customerLastLogin: string, customerLastModifiedDate: string): Promise<CustomerMilestoneDocument>;
    updateCustomerLeads(customerId: SchemaId, lastCreatedLead: LeadDocument | null, customerLastModifiedDate: string): Promise<import("mongoose").Document<unknown, any, import("./schema/customer-milestone.schema").CustomerMilestone> & import("./schema/customer-milestone.schema").CustomerMilestone & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}

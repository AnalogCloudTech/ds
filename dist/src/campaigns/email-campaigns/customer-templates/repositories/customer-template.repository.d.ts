import { CustomerTemplateDocument } from '@/campaigns/email-campaigns/customer-templates/schemas/customer-template.schema';
import { Model } from 'mongoose';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
export declare class CustomerTemplateRepository extends GenericRepository<CustomerTemplateDocument> {
    protected readonly model: Model<CustomerTemplateDocument>;
    constructor(model: Model<CustomerTemplateDocument>);
}

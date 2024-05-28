import { CustomerSubscriptionDocument } from '@/customers/customers/schemas/customer-subscription.schema';
import { Model } from 'mongoose';
import { CreateCustomerSubscriptionDto } from '@/customers/customers/dto/create-customer-subscription.dto';
import { UnsubscriptionReportDto } from '@/customers/customers/dto/unsubscription-report.dto';
import { UpdateCustomerSubscriptionDto } from './dto/update-customer-subscription.dto';
export declare class CustomersSubscriptionsRepository {
    private readonly model;
    constructor(model: Model<CustomerSubscriptionDocument>);
    create(dto: CreateCustomerSubscriptionDto): Promise<CustomerSubscriptionDocument>;
    update(dto: UpdateCustomerSubscriptionDto): Promise<CustomerSubscriptionDocument>;
    unsubscriptionReport(dto: UnsubscriptionReportDto): Promise<Array<CustomerSubscriptionDocument>>;
}

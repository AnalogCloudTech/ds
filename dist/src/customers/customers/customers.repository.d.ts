import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { Customer, CustomerDocument } from '@/customers/customers/schemas/customer.schema';
export declare class CustomersRepository {
    private readonly customerModel;
    constructor(customerModel: Model<Customer>);
    findAll(filter: FilterQuery<CustomerDocument>, options?: QueryOptions): Promise<Array<CustomerDocument>>;
    update(id: string, updateProperties: UpdateQuery<Customer>): Promise<CustomerDocument>;
    find(filter: FilterQuery<Customer>, page?: number, limit?: number): Promise<CustomerDocument[]>;
    findOne(filter: FilterQuery<Customer>): Promise<import("mongoose").Document<unknown, any, Customer> & Customer & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    listByNameOrEmail(nameOrEmail: string): Promise<Array<Partial<CustomerDocument>> | null>;
    findByPhone(phone: string): Promise<CustomerDocument | null>;
}

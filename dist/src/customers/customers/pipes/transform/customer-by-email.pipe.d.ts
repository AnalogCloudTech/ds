import { PipeTransform } from '@nestjs/common';
import { CustomersService } from '@/customers/customers/customers.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
export declare class CustomerByEmailPipe implements PipeTransform {
    private readonly service;
    private readonly request;
    constructor(service: CustomersService, request: any);
    transform(): Promise<CustomerDocument>;
}

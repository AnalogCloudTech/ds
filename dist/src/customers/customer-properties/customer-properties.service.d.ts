import { Logger } from '@nestjs/common';
import { CustomerPropertiesRepository } from '@/customers/customer-properties/repositories/customer-properties.repository';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CreateCustomerPropertiesDto } from '@/customers/customer-properties/dto/create-customer-properties.dto';
import { CustomerPropertiesDocument } from '@/customers/customer-properties/schemas/customer-properties.schemas';
import { GetAllFromCustomerDto } from '@/customers/customer-properties/dto/get-all-from-customer.dto';
import { UpdateCustomerPropertiesDto } from '@/customers/customer-properties/dto/update-customer-properties.dto';
import { SchemaId } from '@/internal/types/helpers';
export declare class CustomerPropertiesService {
    private readonly repository;
    private readonly logger;
    constructor(repository: CustomerPropertiesRepository, logger: Logger);
    create(dto: CreateCustomerPropertiesDto, customer?: CustomerDocument): Promise<CustomerPropertiesDocument>;
    findAll(dto: GetAllFromCustomerDto): Promise<Array<CustomerPropertiesDocument>>;
    update(id: string, dto: UpdateCustomerPropertiesDto, customer: CustomerDocument): Promise<CustomerPropertiesDocument>;
    findOne(id: string): Promise<CustomerPropertiesDocument>;
    softDelete(id: SchemaId): Promise<CustomerPropertiesDocument>;
}

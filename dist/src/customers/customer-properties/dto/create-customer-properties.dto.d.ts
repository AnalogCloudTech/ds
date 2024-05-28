import { SchemaId } from '@/internal/types/helpers';
export declare class CreateCustomerPropertiesDto {
    customer: SchemaId;
    module: string;
    name: string;
    value: string;
    customerEmail: string;
    metadata?: {
        [key: string]: any;
    };
}

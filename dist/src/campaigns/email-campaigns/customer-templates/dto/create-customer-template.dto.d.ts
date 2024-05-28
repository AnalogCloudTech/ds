import { SchemaId } from '@/internal/types/helpers';
export declare class CreateCustomerTemplateDto {
    customer: SchemaId;
    name: string;
    content: string;
    subject: string;
    bodyContent?: string;
    imageUrl?: string;
    templateTitle?: string;
    emailTemplate?: number;
}

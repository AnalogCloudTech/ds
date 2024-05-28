import { SchemaId } from '@/internal/types/helpers';
export declare class CreateMagazineCoverLeadDto {
    customerEmail: string;
    year: string;
    month: string;
    leads: LeadDto[];
}
export declare class LeadDto {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}
export declare class LeadCoversDto {
    lead: SchemaId;
    coversUrl: string;
    fullContentUrl: string;
}

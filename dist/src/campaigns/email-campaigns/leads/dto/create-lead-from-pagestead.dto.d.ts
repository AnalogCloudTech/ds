import { Segments } from '@/campaigns/email-campaigns/leads/domain/types';
import { Address } from './address';
export declare class CreateLeadFromPagesteadDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    segments: Segments;
    allSegments: boolean;
    bookId: string;
    formId: string;
    pageName: string;
    pageTitle: string;
    domain: string;
    customerEmail: string;
    isValid: boolean;
    unsubscribed: boolean;
    address: Address;
}

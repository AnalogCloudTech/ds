import { LeadId, Segments } from './types';
import { Address } from '../dto/address';
export declare class Lead {
    id: LeadId;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bookId: string;
    customerEmail: string;
    allSegments: boolean;
    segments: Segments;
    createdAt: Date;
    isValid: boolean;
    unsubscribed: boolean;
    address: Address;
}

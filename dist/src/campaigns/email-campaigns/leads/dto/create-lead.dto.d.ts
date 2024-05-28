import { Segments } from '@/campaigns/email-campaigns/leads/domain/types';
import { CustomerEmailDto } from '@/internal/common/dtos/customer-email.dto';
import { SegmentsDto } from '@/internal/common/dtos/segments.dto';
import { Address } from './address';
export declare class CreateLeadDto implements CustomerEmailDto, SegmentsDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    segments: Segments;
    allSegments: boolean;
    customerEmail: string;
    bookId: string;
    isValid: boolean;
    unsubscribed: boolean;
    address: Address;
}

import { CustomerId } from '@/customers/customers/domain/types';
export declare class CreateMagazineAdminDto {
    month: string;
    year: string;
    userEmail?: string;
    customerId?: CustomerId;
    createTicket?: boolean;
    isPreview?: boolean;
}

import { CreditType } from '@/credits/domain/book-credits';
export declare class CreateBookCreditsDto {
    credits: number;
    perAmount: number;
    totalAmount: number;
    isActive: boolean;
    type?: CreditType;
    savings?: string;
}

import { CreateProductDto } from '@/onboard/products/dto/create-product.dto';
export declare enum CreditType {
    Book = "book",
    Guide = "guide",
    HolidaySale = "holiday-sale"
}
export declare class BookCredits {
    id: string;
    credits: number;
    perAmount: number;
    totalAmount: number;
    isActive: boolean;
    type?: CreditType;
    product?: CreateProductDto;
    savings?: string;
}

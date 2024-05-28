import { AccountType, OfferCode, OfferImageUrl, OfferType, PaymentProcessorId } from './types';
import { ProductInfo } from './product-info';
import { BookOption } from './book-option';
import { Workflow } from '../schemas/offer.schema';
import { Types } from 'mongoose';
export declare class Offer {
    paymentId?: PaymentProcessorId;
    code: OfferCode;
    title: string;
    trial: number;
    productInfo: ProductInfo[];
    description1: string;
    description2: string;
    whatsIncluded: string[];
    image: OfferImageUrl;
    bookOptions: BookOption[];
    type: OfferType;
    workFlow: Workflow;
    accountType: AccountType;
}
export declare class ContractedOffer {
    code: string;
    title: string;
    id: Types.ObjectId;
    amount: number;
    monthlyPrice?: number;
    save?: number;
    recurrance?: string;
}

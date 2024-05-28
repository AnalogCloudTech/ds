import { Addon } from '../domain/addon';
import { Webinar } from '../domain/webinar';
import { OfferCode, OfferImageUrl, OfferType, PaymentProcessorId } from '../domain/types';
import { ProductInfo } from '../domain/product-info';
import { Workflow } from '../schemas/offer.schema';
export declare class CreateOfferDto {
    paymentId?: PaymentProcessorId;
    code: OfferCode;
    title: string;
    trial: number;
    productInfo: ProductInfo[];
    description1: string;
    description2: string;
    whatsIncluded: string[];
    image: OfferImageUrl;
    type: OfferType;
    workFlow: Workflow;
    addons: Addon[];
    products: string[];
    bookOptions: string[];
    webinar?: Webinar;
}

import { CastableTo } from '@/internal/common/utils';
import { HydratedDocument } from 'mongoose';
import { Offer as DomainOffer } from '../domain/offer';
import { ProductDocument } from '@/onboard/products/schemas/product.schema';
import { AccountType, BookOptionId, BookPackageId, OfferCode, OfferId, OfferImageUrl, OfferType, ProductId, WebinarImageUrl } from '../domain/types';
import { BookOptionDocument } from './book-option.schema';
declare class Webinar {
    id: string;
    title: string;
    description: string;
    image: WebinarImageUrl;
    caption: string;
}
declare class Addon {
    offer: OfferId;
    requirements: string;
}
declare class ProductInfo {
    title: string;
    price: string;
}
export declare class Workflow {
    place_order: string[];
    addon: string[];
    schedule_coaching: string[];
    training_webinar: string[];
    book_details: string[];
    your_book: string[];
}
export declare class Offer extends CastableTo<DomainOffer> {
    code: OfferCode;
    credits: number;
    trial: number;
    packages: BookPackageId[];
    packagesCA: BookPackageId[];
    title: string;
    products: ProductId[] | ProductDocument[];
    productInfo: ProductInfo[];
    description1: string;
    description2: string;
    whatsIncluded: string[];
    bookOptions: BookOptionId[] | BookOptionDocument[];
    nonHeadshotBookOptions: BookOptionId[] | BookOptionDocument[];
    image: OfferImageUrl;
    webinar: Webinar;
    addons: Addon[];
    type: OfferType;
    workFlow: Workflow;
    steps: string[];
    value: number;
    accountType: AccountType;
    hubspotListId: number;
    skipOnboarding: boolean;
}
export type OfferDocument = HydratedDocument<Offer>;
export declare const OfferSchema: import("mongoose").Schema<Offer, import("mongoose").Model<Offer, any, any, any>, any, any>;
export {};

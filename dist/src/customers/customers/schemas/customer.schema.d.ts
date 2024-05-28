import { HydratedDocument } from 'mongoose';
import { AccountType, SMSPreferences, Status } from '../domain/types';
import { Customer as DomainCustomer } from '../domain/customer';
import { CastableTo } from '@/internal/common/utils';
import { CreateAttributesDto } from '../dto/attributesDto';
declare class BookPreferences {
    phone: string;
    name: string;
    email: string;
}
export declare class LandingPageWebsite {
    type: 'GUIDE' | 'BOOK';
    link: string;
    guideId: string;
}
declare class LandingPageProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    brokerAddress: string;
    brokerLogo: string;
    generatedWebsites: LandingPageWebsite[];
}
declare class FlippingBookPreferences {
    publicationId?: string;
    publicationName?: string;
    publicationUrl?: string;
    rawFileUrl?: string;
    permanentPublicationId?: string;
    permanentPublicationName?: string;
    permanentPublicationUrl?: string;
    permanentRawFileUrl?: string;
}
declare class Address {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}
declare class Attributes extends CreateAttributesDto {
}
export declare class Customer extends CastableTo<DomainCustomer> {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    hubspotId: string;
    stripeId: string;
    chargifyId: string;
    bookPreferences: BookPreferences;
    landingPageProfile: LandingPageProfile;
    billing: Address;
    status: Status;
    attributes: Attributes;
    flippingBookPreferences?: FlippingBookPreferences;
    avatar: string;
    smsPreferences: SMSPreferences;
    accountType: AccountType;
}
export type CustomerDocument = HydratedDocument<Customer>;
export declare const CustomerSchema: import("mongoose").Schema<Customer, import("mongoose").Model<Customer, any, any, any>, any, any>;
export {};

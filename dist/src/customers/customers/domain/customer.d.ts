import { Address } from './address';
import { Attributes } from './attributes';
import { CustomerId, HubspotId, StripeId } from './types';
import { FlippingBookPreferences } from '@/customers/customers/domain/flipping-book-preferences';
import { LandingPageWebsite } from '@/customers/customers/schemas/customer.schema';
export declare class Customer {
    id: CustomerId;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
    hubspotId?: HubspotId;
    stripeId?: StripeId;
    billing: Address;
    attributes: Attributes;
    flippingBookPreferences: FlippingBookPreferences;
    avatar?: string;
    landingPageProfile: LandingPageWebsite;
}

import { Magazine } from '@/referral-marketing/magazines/schemas/magazine.schema';
import { ObjectId } from 'mongoose';
import { Customer as CustomerDomain } from '@/customers/customers/domain/customer';
import { LeadCoversDto } from '../dto/create-magazine-cover-lead.dto';
export declare class GeneratedMagazineDomain {
    id: ObjectId;
    customer: CustomerDomain;
    magazine: Magazine;
    url: string;
    status: string;
    active: boolean;
    isPreview: boolean;
    coverImage: string;
    flippingBookUrl: string;
    additionalInformation: string;
    pageUrl: string;
    bookUrl: string;
    pageStatus: string;
    createdAt: Date;
    updatedAt: Date;
    coversOnlyUrl: string;
    leadCovers: LeadCoversDto;
}

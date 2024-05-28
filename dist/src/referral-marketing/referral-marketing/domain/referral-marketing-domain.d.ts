import { ObjectId } from 'mongoose';
import { AdditionalCustomization, FrontCover, InsideCover, ListingDetails, MemberDetails, ReferralPartner, Testimonials } from '@/referral-marketing/referral-marketing/domain/types';
export declare class ReferralMarketingDomain {
    id: ObjectId;
    referralCode: string;
    changeStatus: string;
    marketingType: string;
    magazineTemplate: string;
    internalNotes: string[];
    memberDetails: MemberDetails;
    frontCover: FrontCover;
    insideCover: InsideCover;
    backInsideCoverTemplate: Testimonials;
    backCoverTemplate: string;
    additionalInstructions: string;
    additionalCustomization: AdditionalCustomization;
    listingDetails: ListingDetails;
    referralPartner: ReferralPartner;
}

import { Document } from 'mongoose';
import { CastableTo } from '@/internal/common/utils';
import { ReferralMarketingDomain } from '../domain/referral-marketing-domain';
import { AdditionalCustomization, FrontCover, InsideCover, ListingDetails, MemberDetails, ReferralPartner, Testimonials } from '@/referral-marketing/referral-marketing/domain/types';
export declare class ReferralMarketing extends CastableTo<ReferralMarketingDomain> {
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
export type ReferralDocument = ReferralMarketing & Document;
export declare const ReferralSchema: import("mongoose").Schema<ReferralMarketing, import("mongoose").Model<ReferralMarketing, any, any, any>, any, any>;

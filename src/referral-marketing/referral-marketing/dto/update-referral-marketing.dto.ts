import {
  AdditionalCustomization,
  FrontCover,
  InsideCover,
  ListingDetails,
  MemberDetails,
  ReferralPartner,
  Testimonials,
} from '../domain/types';

export class UpdateReferralMarketingDto {
  referralCode?: string;

  magazineTemplate?: string;

  changeStatus?: string;

  marketingType?: string;

  internalNotes?: string[];

  memberDetails?: MemberDetails;

  frontCover?: FrontCover;

  insideCover?: InsideCover;

  backInsideCoverTemplate?: Testimonials;

  backCoverTemplate?: string;

  additionalInstructions?: string;

  additionalCustomization?: AdditionalCustomization;

  listingDetails?: ListingDetails;

  referralPartner?: ReferralPartner;
}

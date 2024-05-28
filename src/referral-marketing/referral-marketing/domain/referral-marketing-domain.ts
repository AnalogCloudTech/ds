import { IsMongoId } from 'class-validator';
import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';
import {
  AdditionalCustomization,
  FrontCover,
  InsideCover,
  ListingDetails,
  MemberDetails,
  ReferralPartner,
  Testimonials,
} from '@/referral-marketing/referral-marketing/domain/types';

export class ReferralMarketingDomain {
  @IsMongoId()
  @Expose()
  id: ObjectId;

  @Expose()
  referralCode: string;

  @Expose()
  changeStatus: string;

  @Expose()
  marketingType: string;

  @Expose()
  magazineTemplate: string;

  @Expose()
  internalNotes: string[];

  @Expose()
  memberDetails: MemberDetails;

  @Expose()
  frontCover: FrontCover;

  @Expose()
  insideCover: InsideCover;

  @Expose()
  backInsideCoverTemplate: Testimonials;

  @Expose()
  backCoverTemplate: string;

  @Expose()
  additionalInstructions: string;

  @Expose()
  additionalCustomization: AdditionalCustomization;

  @Expose()
  listingDetails: ListingDetails;

  @Expose()
  referralPartner: ReferralPartner;
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CastableTo } from '@/internal/common/utils';
import { ReferralMarketingDomain } from '../domain/referral-marketing-domain';
import {
  AdditionalCustomization,
  ChangeStatus,
  FrontCover,
  InsideCover,
  Leads,
  ListingDetails,
  MemberDetails,
  ReferralPartner,
  Testimonials,
} from '@/referral-marketing/referral-marketing/domain/types';

@Schema({ timestamps: true, collection: 'ds__referral_marketing' })
export class ReferralMarketing extends CastableTo<ReferralMarketingDomain> {
  @Prop({ unique: true })
  referralCode: string;

  @Prop({
    required: true,
    enum: ChangeStatus,
  })
  changeStatus: string;

  @Prop({
    required: true,
    enum: Leads,
  })
  marketingType: string;

  @Prop({ required: true })
  magazineTemplate: string;

  @Prop({ required: true })
  internalNotes: string[];

  @Prop({ type: Object, required: true })
  memberDetails: MemberDetails;

  @Prop({ type: Object, required: true })
  frontCover: FrontCover;

  @Prop({ type: Object, required: true })
  insideCover: InsideCover;

  @Prop()
  backInsideCoverTemplate: Testimonials;

  @Prop({ required: true })
  backCoverTemplate: string;

  @Prop({ required: true })
  additionalInstructions: string;

  @Prop({ type: Object, required: true })
  additionalCustomization: AdditionalCustomization;

  @Prop({ type: Object, required: true })
  listingDetails: ListingDetails;

  @Prop({ type: Object, require: true })
  referralPartner: ReferralPartner;
}

export type ReferralDocument = ReferralMarketing & Document;
export const ReferralSchema = SchemaFactory.createForClass(ReferralMarketing);

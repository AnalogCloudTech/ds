import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';
import {
  Customer,
  CustomerDocument,
} from '@/customers/customers/schemas/customer.schema';
import {
  Magazine,
  MagazineDocument,
} from '@/referral-marketing/magazines/schemas/magazine.schema';
import { SchemaId } from '@/internal/types/helpers';
import { LeadDocument } from '@/campaigns/email-campaigns/leads/schemas/lead.schema';

export enum GenerationStatus {
  DONE = 'DONE',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  ERROR = 'ERROR',
  SENT_FOR_PRINTING = 'SENT_FOR_PRINTING',
}

@Schema({
  timestamps: true,
  collection: 'ds__referralMarketing__generatedMagazine',
})
export class GeneratedMagazine {
  @Prop({ ref: Customer.name, type: SchemaTypes.ObjectId, required: true })
  customer: mongoose.Types.ObjectId | CustomerDocument;

  @Prop({ ref: Magazine.name, type: SchemaTypes.ObjectId, required: true })
  magazine: mongoose.Types.ObjectId | MagazineDocument;

  @Prop({ default: '' })
  url: string;

  @Prop({
    required: true,
    enum: GenerationStatus,
    default: GenerationStatus.PENDING,
  })
  status: string;

  @Prop({ required: true, default: true })
  active: boolean;

  @Prop({ default: null })
  additionalInformation: string;

  @Prop({ default: false })
  isPreview: boolean;

  @Prop({ default: '' })
  flippingBookUrl: string;

  @Prop({ default: '' })
  coverImage: string;

  @Prop({ default: '' })
  pageUrl: string;

  @Prop({ default: '' })
  bookUrl: string;

  @Prop({
    required: true,
    enum: GenerationStatus,
    default: GenerationStatus.PENDING,
  })
  pageStatus: string;

  @Prop({ default: '' })
  coversOnlyUrl: string;

  @Prop({ required: false, default: false })
  createdByAutomation?: boolean;

  @Prop({ required: false, default: [] })
  leadCovers: {
    lead?: SchemaId | LeadDocument;
    coversUrl?: string;
    fullContentUrl?: string;
  }[];
}

export type GeneratedMagazineDocument = HydratedDocument<GeneratedMagazine>;
export const GeneratedMagazineSchema =
  SchemaFactory.createForClass(GeneratedMagazine);

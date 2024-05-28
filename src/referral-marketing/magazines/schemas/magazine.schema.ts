import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';
import {
  Customer,
  CustomerDocument,
} from '@/customers/customers/schemas/customer.schema';
import {
  Cover,
  MagazineContent,
  Replacer,
  Selection,
} from '@/referral-marketing/magazines/domain/types';
import { Months } from '@/internal/utils/date';

export enum MagazineStatus {
  EDITING = 'EDITING',
  MAGAZINE_GENERATED = 'MAGAZINE_GENERATED',
  SENT_FOR_PRINTING = 'SENT_FOR_PRINTING',
}

@Schema({
  timestamps: true,
  collection: 'ds__referralMarketing__magazine',
})
export class Magazine {
  @Prop({ ref: Customer.name, type: SchemaTypes.ObjectId, required: true })
  customer: CustomerDocument | mongoose.Types.ObjectId;

  @Prop({ required: true, enum: Months })
  month: string;

  @Prop({ required: true })
  year: string;

  @Prop()
  selections: Selection[];

  @Prop({ type: SchemaTypes.Mixed })
  magazineContent: MagazineContent;

  @Prop()
  covers: Cover[];

  @Prop({ required: true })
  magazineId: number;

  @Prop({ default: [] })
  baseReplacers: Replacer[];

  @Prop({
    required: true,
    enum: MagazineStatus,
    default: MagazineStatus.EDITING,
  })
  status: string;

  @Prop({ required: true })
  contentUrl: string;

  @Prop({ required: false, default: false })
  createdByAutomation?: boolean;
}

export type MagazineDocument = HydratedDocument<Magazine>;
export const MagazineSchema = SchemaFactory.createForClass(Magazine);

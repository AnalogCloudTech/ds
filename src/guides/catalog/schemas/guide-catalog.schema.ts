import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum Type {
  MAGAZINE = 'magazine',
  GUIDE = 'guide',
  BOOK = 'book',
  PACKET = 'packet',
}

@Schema({
  timestamps: true,
  collection: 'ds__guide_catalog',
})
export class GuideCatalog {
  @Prop({ type: String, required: true })
  guideName: string;

  @Prop({ type: String, required: true })
  guideId: string;

  @Prop({ type: String, required: true })
  thumbnail: string;

  @Prop({ type: String, required: false })
  pdfUrl?: string;

  @Prop({ type: Number, required: true })
  position: number;

  @Prop({ enum: Type, required: true })
  type: Type;
}

export type GuideCatalogDocument = HydratedDocument<GuideCatalog>;
export const GuideCatalogSchema = SchemaFactory.createForClass(GuideCatalog);

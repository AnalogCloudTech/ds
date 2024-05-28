import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, collection: 'ds__tracking_pixels' })
export class TrackingPixel {
  @Prop({ required: true })
  offerCode: string;

  @Prop({ required: true })
  trackingCode: string;
}

export type TrackingPixelDocument = HydratedDocument<TrackingPixel>;
export const TrackingPixelSchema = SchemaFactory.createForClass(TrackingPixel);

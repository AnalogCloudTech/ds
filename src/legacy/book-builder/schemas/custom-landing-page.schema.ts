import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'ds__custom_landing_page',
})
export class CustomLandingPage {
  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  email: string;
}

export type CustomLandingPageDocument = CustomLandingPage & Document;
export const CustomLandingPageSchema =
  SchemaFactory.createForClass(CustomLandingPage);

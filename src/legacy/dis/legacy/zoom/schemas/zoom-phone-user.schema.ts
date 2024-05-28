import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTimestampsConfig } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'ds__zoom_phone_users',
})
export class ZoomPhoneUser {
  @Prop({ required: true })
  email: string;
}

export type ZoomPhoneUserDocument = SchemaTimestampsConfig &
  HydratedDocument<ZoomPhoneUser>;
export const ZoomPhoneUserSchema = SchemaFactory.createForClass(ZoomPhoneUser);

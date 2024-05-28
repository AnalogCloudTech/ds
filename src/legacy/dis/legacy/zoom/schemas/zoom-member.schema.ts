import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'ds__zoom_member',
})
export class ZoomMember {
  @Prop({ required: true })
  hostEmail: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  zoomAwsUpload: boolean;

  @Prop({ required: true })
  zoomAwsDelete: boolean;

  @Prop({ required: true })
  zoomAppInstantDelete: boolean;

  @Prop({ required: true })
  zoomAppLaterDelete: boolean;

  @Prop({ required: true })
  zoomIQSalesAccount: boolean;
}

export type ZoomMemberDocument = HydratedDocument<ZoomMember>;
export const ZoomMemberSchema = SchemaFactory.createForClass(ZoomMember);

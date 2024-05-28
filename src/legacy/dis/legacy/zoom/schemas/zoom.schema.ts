import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Type } from 'class-transformer';

@Schema({
  timestamps: true,
  collection: 'ds__zoom_recording',
})
export class ZoomRecording {
  @Prop({ required: true })
  hostEmail: string;

  @Prop({ required: true })
  fileLocation: string;

  @Prop({ required: true })
  bucketName: string;

  @Prop({ required: true })
  keyName: string;

  @Prop({ required: true })
  zoomMeetingId: number;

  @Prop({ required: true })
  zoomMeetinguuid: string;

  @Prop({ required: true })
  topic: string;

  @Prop({ default: null })
  @Type(() => Date)
  zoomCloudDeletedAt: Date;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  startTime: string;

  @Prop({ default: null })
  @Type(() => Date)
  deletedAt: Date;
}

export type ZoomRecordingDocument = HydratedDocument<ZoomRecording>;
export const ZoomRecordingSchema = SchemaFactory.createForClass(ZoomRecording);

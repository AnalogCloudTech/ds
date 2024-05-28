import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CoachImageUrl, HubspotId } from '../domain/types';

@Schema({
  timestamps: true,
  collection: 'ds__coaches',
  optimisticConcurrency: true,
})
export class Coach {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ type: String })
  hubspotId: HubspotId;

  @Prop({ type: String })
  image: CoachImageUrl;

  @Prop()
  calendarId: string;

  @Prop()
  meetingLink: string;

  @Prop({ type: Number })
  schedulingPoints = 0;

  @Prop({ default: true, type: Boolean })
  enabled: boolean;
}

export type CoachDocument = HydratedDocument<Coach>;
export const CoachSchema = SchemaFactory.createForClass(Coach);

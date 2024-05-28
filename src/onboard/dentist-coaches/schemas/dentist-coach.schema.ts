import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'ds__dentist_coaches',
  optimisticConcurrency: true,
})
export class DentistCoach {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ type: String })
  hubspotId: string;

  @Prop({ type: String })
  image: string;

  @Prop()
  calendarId: string;

  @Prop()
  meetingLink: string;

  @Prop({ type: Number })
  schedulingPoints = 0;

  @Prop({ default: true, type: Boolean })
  enabled: boolean;
}

export type DentistCoachDocument = HydratedDocument<DentistCoach>;
export const DentistCoachSchema = SchemaFactory.createForClass(DentistCoach);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'ds__socialMedia__facebook' })
export class Facebook {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  photo: string;
}

export type FacebookDocument = Facebook & Document;
export const FacebookSchema = SchemaFactory.createForClass(Facebook);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ApiKey {
  @Prop({ virtual: true })
  id: string;

  @Prop()
  title: string;

  @Prop({
    unique: true,
  })
  key: string;
}

export type ApiKeyDocument = ApiKey & Document;
export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);

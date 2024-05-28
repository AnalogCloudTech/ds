import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'ds__onboard__webhook_idempotency' })
export class WebhookIdempotency {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  objectType: string;
}

export type WebhookIdempotencyDocument = WebhookIdempotency & Document;
export const WebhookIdempotencySchema =
  SchemaFactory.createForClass(WebhookIdempotency);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * @deprecated remove this collection after the migration
 */
@Schema({ timestamps: true, collection: 'product_configs' })
export class ProductIntegration {
  @Prop()
  stripeId: string;

  @Prop()
  chargifyId: string;

  @Prop()
  name: string;

  @Prop()
  product: string;

  @Prop()
  productProperty: string;

  @Prop()
  priceProperty: string;

  @Prop()
  value: string;

  @Prop()
  credits_once: number;

  @Prop()
  credits_recur: number;

  @Prop()
  book_packages: string;

  @Prop()
  formUrl: string;

  @Prop()
  dealPipeline: string;

  @Prop()
  dealStage: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type ProductIntegrationDocument = HydratedDocument<ProductIntegration>;
export const ProductIntegrationSchema =
  SchemaFactory.createForClass(ProductIntegration);

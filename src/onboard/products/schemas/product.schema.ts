import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CastableTo } from '@/internal/common/utils';
import {
  HubspotPriceProperty,
  HubspotProductProperty,
  Type,
} from '../domain/types';
import { Product as DomainProduct } from '../domain/product';

@Schema({ timestamps: true, collection: 'ds__products' })
export class Product extends CastableTo<DomainProduct> {
  @Prop()
  title: string;

  @Prop()
  stripeId: string;

  @Prop({ type: String, enum: Type })
  type: Type;

  @Prop()
  value: number;

  @Prop()
  chargifyComponentId: string;

  @Prop()
  chargifyProductHandle: string;

  @Prop()
  chargifyProductPriceHandle: string;

  @Prop()
  price: string;

  // Exported from Integration

  @Prop()
  product: string;

  @Prop({ type: String, enum: HubspotProductProperty })
  productProperty: HubspotProductProperty;

  @Prop({ type: String, enum: HubspotPriceProperty })
  priceProperty: HubspotPriceProperty;

  @Prop()
  creditsOnce: number;

  @Prop()
  toShowBuyCredits: boolean;

  @Prop()
  creditsRecur: number;

  @Prop()
  bookPackages: string;

  @Prop()
  productWithoutTrial: boolean;

  @Prop({ default: null })
  hubspotListId: number;

  @Prop()
  upgradeDowngrade: boolean;
}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);

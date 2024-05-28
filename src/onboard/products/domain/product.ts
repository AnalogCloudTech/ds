import { Expose } from 'class-transformer';
import {
  ChargifyId,
  HubspotPriceProperty,
  HubspotProductProperty,
  ProductId,
  StripeId,
  Type,
} from './types';

export class Product {
  /**
   * Product id
   */
  @Expose()
  id: ProductId;

  @Expose()
  title: string;

  @Expose()
  stripeId: StripeId;

  @Expose()
  type: Type;

  @Expose()
  chargifyComponentId: ChargifyId;

  @Expose()
  chargifyProductHandle: ChargifyId;

  @Expose()
  chargifyProductPriceHandle: ChargifyId;

  // Exported from Integration

  @Expose()
  productProperty: HubspotProductProperty;

  @Expose()
  priceProperty: HubspotPriceProperty;

  @Expose()
  value: number;

  @Expose()
  creditsOnce: number;

  @Expose()
  toShowBuyCredits: number;

  @Expose()
  creditsRecur: number;

  @Expose()
  productWithoutTrial: boolean;
}

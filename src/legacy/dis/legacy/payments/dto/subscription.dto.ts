import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested, IsString } from 'class-validator';
import { Stripe as StripeLib } from 'stripe';
import { SubscriptionProduct, OneTimeProduct } from './product.dto';

export class CreateSubscriptionDto {
  @IsString()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubscriptionProduct)
  products: SubscriptionProduct[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OneTimeProduct)
  oneTimeProducts?: OneTimeProduct[];

  /**
   * number of trial days to add to the subscription, 0 if no trial added
   *
   * @example 30
   */
  @IsNumber()
  trialPeriod: number;
  /**
   * Arbitrary data
   *
   * @example {"pet": "dog", "favoriteColor": "green"}
   */
  metadata?: any;
}
export class SubscriptionProrationDto {
  @IsString()
  subscriptionId: string;

  @IsString()
  newPriceId: string;
}

export class SubscriptionProrationResponse {
  amountDue: number;
  amountPaid: number;
  amountRemaining: number;
  prorationDate: string | null;
  subTotal: number;
  total: number;
  nextPaymentAttempt: string;
  subscriptionId: string;
  startingBalance: number;
  newPriceId: string;
  newPriceNickname: string;
  newPriceValue: number;
  lineItems: LineItem[];
}

export class LineItem {
  amount: number;
  description: string;
}
export class UpgradeSubscriptionDto extends SubscriptionProrationDto {
  @IsString()
  prorationDate: string;

  @IsString()
  paymentMethodId: string;
}

export class UpgradeSubscriptionResponse {
  listItems: ListItem[];
  billingCycleAnchor: string;
  currentPeriodEnd: string;
  currentPeriodStart: string;
  status: string;
  trialEnd: string;
}

export class ListItem {
  priceId: string;
  nickName: string;
  amount: number;
  interval: string;
  intervalCount: number;
  quantity: number;
}

export type Subscription = StripeLib.Subscription;
export enum ProrationBehavior {
  ALWAYS_INVOICE = 'always_invoice',
  CREATE_PRORATIONS = 'create_prorations',
  NONE = 'none',
}
export type SubscriptionUpdateParams = StripeLib.SubscriptionUpdateParams;

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTimestampsConfig } from 'mongoose';

export class Transaction {
  id: string;
  subscription_id: string;
  type: string;
  kind: string;
  transaction_type: string;
  success: string;
  amount_in_cents: string;
  memo: string;
  created_at: string;
  starting_balance_in_cents: string;
  ending_balance_in_cents: string;
  gateway_used: string;
  gateway_transaction_id: string;
  gateway_response_code: string;
  gateway_order_id: string;
  payment_id: string;
  product_id: string;
  tax_id: string;
  component_id: string;
  statement_id: string;
  customer_id: string;
  item_name: string;
  period_range_start: string;
  period_range_end: string;
  currency: string;
  exchange_rate: string;
  component_handle: string;
  component_price_point_id: string;
  component_price_point_handle: string;
  site_gateway_setting_id: string;
  gateway_handle: string;
  parent_id: string;
  role: string;
  card_number: string;
  card_expiration: string;
  card_type: string;
  refunded_amount_in_cents: string;
  received_on: string;
  invoice_uids: string[];
  invoice_id: string;
}

@Schema({
  timestamps: true,
  collection: 'ds__payments__paymentStatus',
})
export class PaymentStatus {
  @Prop({ required: true })
  transaction: Transaction;

  @Prop({ required: true })
  status: 'SUCCESS' | 'FAILURE' | 'PENDING' | 'REFUNDED' | 'VOIDED';
}

export type PaymentStatusDocument = HydratedDocument<PaymentStatus> &
  SchemaTimestampsConfig;
export const PaymentStatusSchema = SchemaFactory.createForClass(PaymentStatus);

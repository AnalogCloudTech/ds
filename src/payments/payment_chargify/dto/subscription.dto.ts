import {
  Product,
  SubscriptionComponent,
} from '@/payments/chargify/domain/types';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Customer } from './customer.dto';

export class SubscriptionDto {
  @IsOptional()
  @IsString()
  customer_id?: number;

  @IsOptional()
  @IsString()
  product_handle?: string;

  @IsOptional()
  @IsNumber()
  product_id?: number;

  next_billing_at?: any;

  customer_attributes: Customer;

  components?: Array<
    Pick<SubscriptionComponent, 'component_id' | 'allocated_quantity'>
  >;

  credit_card_attributes?: CreditCardAttributes;

  metafields?: { [key: string]: any };
}

export class CreditCardAttributes {
  @IsString()
  full_number?: string;

  @IsString()
  expiration_month?: string;

  @IsString()
  expiration_year?: string;

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  payment_type?: string;

  @IsString()
  @IsOptional()
  chargify_token?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  current_vault?: string;

  @IsString()
  @IsOptional()
  vault_token?: string;

  @IsString()
  @IsOptional()
  gateway_handle?: string;
}

export class updatePaymentMethod {
  @ValidateNested()
  credit_card_attributes?: CreditCardAttributes;

  @IsString()
  next_billing_at?: string;

  @IsString()
  product_handle?: string;
}

export class CreateSubscriptionDto {
  @ValidateNested()
  subscription: SubscriptionDto;
}

export class ProductChange {
  @IsString()
  product_id: string;

  @IsString()
  product_handle: string;
}

export class UpdateSubscriptionDto {
  @ValidateNested()
  subscription: updatePaymentMethod;
}

export class PurgeQuery {
  @IsNumber()
  ack?: number;

  @IsNumber()
  subscription_id?: number;

  @IsArray()
  cascade?: string[];
}

export class SubscriptionObjDto {
  @ValidateNested()
  @IsOptional()
  component?: SubscriptionComponent;

  @ValidateNested()
  product: Partial<Product>;
  @IsString()
  currency: string;

  @IsString()
  current_period_ends_at: string;

  @IsNumber()
  id: number;

  @IsString()
  signup_revenue: string;

  @IsString()
  state: string;
}

export class CurrentSubscriptionDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @ValidateNested()
  subscription: SubscriptionObjDto;
}

export class ComponentPriceDto {
  @IsNumber()
  id: number;

  @IsNumber()
  component_id: number;

  @IsNumber()
  starting_quantity: number;

  @IsNumber()
  ending_quantity: number | null;

  @IsString()
  unit_price: string;

  @IsNumber()
  price_point_id: number;

  @IsString()
  formatted_unit_price: string;

  @IsNumber()
  segment_id: number | null;
}

export class ComponentPriceInfoDto {
  @IsNumber()
  id: number;

  @IsBoolean()
  default: boolean;
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  pricing_scheme: string;

  @IsNumber()
  component_id: number;

  @IsString()
  handle: string;

  @IsString()
  archived_at: string | null;

  @IsString()
  created_at: string;

  @IsString()
  updated_at: string;

  @ValidateNested()
  prices: ComponentPriceDto[];
  @IsBoolean()
  tax_included: boolean;
}

class EventSpecificData {
  @IsOptional()
  @IsNumber()
  previous_allocation?: number | null;

  @IsOptional()
  @IsNumber()
  new_allocation?: number | null;

  @IsOptional()
  @IsNumber()
  component_id?: number | null;

  @IsOptional()
  @IsString()
  component_handle?: string | null;

  @IsOptional()
  @IsString()
  memo?: string | null;

  @IsOptional()
  @IsNumber()
  allocation_id?: number | null;

  @IsOptional()
  @IsString()
  uid?: string | null;

  @IsOptional()
  @IsString()
  number?: string | null;

  @IsOptional()
  role?: string | null;

  @IsOptional()
  @IsString()
  due_date?: string | null;

  @IsOptional()
  issue_date?: string | null;

  @IsOptional()
  @IsString()
  paid_date?: string | null;

  @IsOptional()
  @IsString()
  due_amount?: string | null;

  @IsOptional()
  @IsString()
  paid_amount?: string | null;

  @IsOptional()
  @IsString()
  tax_amount?: string | null;

  @IsOptional()
  @IsString()
  refund_amount?: string | null;

  @IsOptional()
  @IsString()
  total_amount?: string | null;

  @IsOptional()
  @IsString()
  status_amount?: string | null;

  @IsOptional()
  @ValidateNested()
  line_items?: LineItemsEntity[] | null;

  @IsOptional()
  @IsString()
  product_name?: string | null;

  @IsOptional()
  @IsString()
  reason?: string | null;

  @IsOptional()
  @IsNumber()
  service_credit_account_balance_in_cents?: number | null;

  @IsOptional()
  @IsNumber()
  service_credit_balance_change_in_cents?: number | null;

  @IsOptional()
  @IsString()
  currency_code?: string | null;

  @IsOptional()
  @IsString()
  at_time?: string | null;

  @IsOptional()
  @IsNumber()
  product_id?: number;

  @IsOptional()
  @IsNumber()
  account_transaction_id?: number;
}

class LineItemsEntity {
  @IsString()
  uid: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  quantity: string;

  @IsString()
  unit_price: string;

  @IsString()
  period_range_start: string;

  @IsString()
  period_range_end: string;

  @IsString()
  amount: string;

  @IsString()
  line_references: string;

  @IsOptional()
  @IsNumber()
  pricing_details_index?: number | null;

  @IsOptional()
  @ValidateNested()
  pricing_details?: PricingDetailsEntity[] | null;

  @IsString()
  tax_code: string;

  @IsString()
  tax_amount: string;

  @IsNumber()
  product_id: number;

  @IsNumber()
  product_price_point_id: number;

  @IsNumber()
  price_point_id: number;

  @IsNumber()
  component_id: number;

  @IsOptional()
  @IsString()
  custom_item?: null;
}

class PricingDetailsEntity {
  @IsString()
  label: string;

  @IsString()
  amount: string;
}

export class SubscriptionEvent {
  @IsNumber()
  id: number;

  @IsString()
  key: string;

  @IsString()
  message: string;

  @IsNumber()
  subscription_id: number;

  @IsNumber()
  customer_id: number;

  @IsString()
  created_at: string;

  @ValidateNested()
  event_specific_data: EventSpecificData;
}

export class Events {
  @ValidateNested()
  event: SubscriptionEvent;
}

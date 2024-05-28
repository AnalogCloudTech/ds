export class AllocationInfo {
  component_id: number;
  quantity: number;
  memo: string;
}

export class CreatePreviewAllocationDto {
  allocations: AllocationInfo[];
}

export class AllocateComponentDto {
  subscriptionId: number;
  newComponentId: number;
}

export interface AllocationsPreview {
  allocation_preview: AllocationPreview;
}
export interface AllocationPreview {
  start_date: string;
  end_date: string;
  period_type: string;
  total_in_cents: number;
  total_discount_in_cents: number;
  total_tax_in_cents: number;
  subtotal_in_cents: number;
  existing_balance_in_cents: number;
  direction: string;
  proration_scheme: string;
  line_items?: LineItemsEntity[] | null;
  allocations?: AllocationsEntity[] | null;
  accrue_charge: boolean;
  initiate_dunning: boolean;
  upgrade_charge: string;
}
interface LineItemsEntity {
  transaction_type: string;
  kind: string;
  amount_in_cents: number;
  memo: string;
  discount_amount_in_cents: number;
  taxable_amount_in_cents: number;
  component_id: number;
  component_handle: string;
}

export interface AllocationProduct {
  id: number;
  amout_in_cents: string;
  success: boolean;
  memo: string;
}
export interface AllocationsEntity {
  allocation_id?: null;
  component_id: number;
  subscription_id: number;
  quantity: number;
  previous_quantity: number;
  memo: string;
  timestamp?: null;
  proration_upgrade_scheme: string;
  proration_downgrade_scheme: string;
  price_point_id: number;
  price_point_handle: string;
  price_point_name: string;
  previous_price_point_id: number;
  component_handle: string;
  accrue_charge: boolean;
  upgrade_charge: string;
  downgrade_credit: string;
  created_at?: null;
  initiate_dunning: boolean;
  payment?: AllocationProduct | null;
  renewalDate: string;
}

export interface Allocations {
  allocation: Allocation;
}
export interface Allocation {
  component_id: number;
  subscription_id: number;
  quantity: number;
  previous_quantity: number;
  memo: string;
  timestamp: string;
  proration_upgrade_scheme: string;
  proration_downgrade_scheme: string;
  payment: SubscriptionPayment;
  renewalDate?: string;
}
interface SubscriptionPayment {
  amount_in_cents: number;
  success: boolean;
  memo: string;
  id: number;
}

export interface ActivateSubscription {
  revert_on_failure: boolean;
}

import { Customer } from '@/customers/customers/schemas/customer.schema';
import { FlippingBookPreferences } from '@/customers/customers/domain/flipping-book-preferences';

export type UpdateCustomerDto = Partial<Customer>;

export type UpdateCustomerFlippingBookPreferences =
  Partial<FlippingBookPreferences>;

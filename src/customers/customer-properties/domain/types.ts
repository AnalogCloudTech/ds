import { CustomerProperties } from '@/customers/customer-properties/schemas/customer-properties.schemas';

export type Version = Pick<
  CustomerProperties,
  'value' | 'updatedBy' | 'updatedAt'
>;
export type Versions = Array<Version>;

import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';

export interface ListMagazineDto {
  customer: CustomerDocument;
  month?: string;
  year?: string;
  page?: number;
  perPage?: number;
  sortOrder?: string;
  status?: string;
}

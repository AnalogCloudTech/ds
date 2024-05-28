import { Expose, Type } from 'class-transformer';
import { ExposeId } from '@/internal/common/interceptors/serialize.interceptor';
import { Versions } from '@/customers/customer-properties/domain/types';
import { Customer as CustomerDomain } from '@/customers/customers/domain/customer';

export class CustomerProperties {
  @Expose()
  @ExposeId()
  id: string;

  @Expose()
  @Type(() => CustomerDomain)
  customer: CustomerDomain;

  @Expose()
  module: string;

  @Expose()
  name: string;

  @Expose()
  value: string;

  @Expose()
  versions: Versions;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt: Date;
}

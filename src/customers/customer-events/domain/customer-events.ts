import { Expose } from 'class-transformer';
import { ExposeId } from '@/internal/common/interceptors/serialize.interceptor';
import { ObjectId } from 'mongoose';
import { Events } from '@/customers/customer-events/domain/types';

export class CustomerEvents {
  @Expose()
  @ExposeId()
  id: string;

  @Expose()
  @ExposeId()
  customer: ObjectId;

  @Expose()
  event: Events;

  @Expose()
  metadata: object;

  @Expose()
  createdAt: Date;
}

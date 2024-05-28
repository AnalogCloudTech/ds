import { ObjectId } from 'mongoose';
import { Expose } from 'class-transformer';

export class CustomerSubscription {
  @Expose()
  id: ObjectId;

  @Expose()
  customer: ObjectId;

  @Expose()
  createdAt: Date;
}

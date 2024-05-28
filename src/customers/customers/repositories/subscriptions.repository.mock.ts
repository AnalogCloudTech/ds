import { CustomerSubscriptionDocument } from '@/customers/customers/schemas/customer-subscription.schema';
import { SchemaId } from '@/internal/types/helpers';
import { ObjectId } from 'mongodb';

export class SubscriptionsRepositoryMock {
  create(): Promise<CustomerSubscriptionDocument> {
    return;
  }

  updateOne(): Promise<any> {
    return;
  }

  unsubscriptionReport(): Promise<any> {
    return;
  }

  findSubscription(dto: { customerId: SchemaId }) {
    return Promise.resolve({
      _id: new ObjectId(),
      subscriptionId: '123',
      customer: dto.customerId,
    });
  }
}

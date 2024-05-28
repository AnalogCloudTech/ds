import { CustomerDocument } from '../schemas/customer.schema';
import { SubscriptionsRepository } from './../repositories/subscriptions.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
  ) {}

  getSubscription(customer: CustomerDocument) {
    return this.subscriptionsRepository.findSubscription({
      customerId: customer._id,
    });
  }
}

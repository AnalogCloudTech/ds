import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { Controller, Get, Param } from '@nestjs/common';
import { CustomerDocument } from '../schemas/customer.schema';
import { SubscriptionsService } from '../services/subscriptions.service';

@Controller({ path: 'subscriptions', version: '1' })
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('/find-one')
  async getSubscription(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.subscriptionsService.getSubscription(customer);
  }
}

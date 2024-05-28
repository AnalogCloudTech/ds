import { Test } from '@nestjs/testing';
import { SubscriptionsService } from '@/customers/customers/services/subscriptions.service';
import { SubscriptionsRepository } from '@/customers/customers/repositories/subscriptions.repository';
import { SubscriptionsRepositoryMock } from '@/customers/customers/repositories/subscriptions.repository.mock';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { ObjectId } from 'mongodb';

describe('SubscriptionsService', () => {
  let subscriptionService: SubscriptionsService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: SubscriptionsRepository,
          useClass: SubscriptionsRepositoryMock,
        },
        SubscriptionsService,
      ],
    }).compile();

    subscriptionService = app.get<SubscriptionsService>(SubscriptionsService);
  });

  it('Should be defined', () => {
    expect(subscriptionService).toBeDefined();
  });

  it('Should return a subscription status', async () => {
    const customer = {
      _id: new ObjectId(),
    };
    const response = await subscriptionService.getSubscription(
      <CustomerDocument>customer,
    );
    expect(response).toBeDefined();
  });
});

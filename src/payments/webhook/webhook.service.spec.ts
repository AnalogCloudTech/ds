import { Test } from '@nestjs/testing';
import { rootMongooseTestModule } from '../../../test/utils/db.handler';
import { CustomersModule } from '@/customers/customers/customers.module';
import { WebhookModule } from '@/payments/webhook/webhook.module';
import { ConfigModule } from '@nestjs/config';
import { WebhookService } from '@/payments/webhook/webhook.service';
import { CustomersService } from '@/customers/customers/customers.service';
import { CreateCustomerDto } from '@/customers/customers/dto/create-customer.dto';
import { Status } from '@/customers/customers/domain/types';
import { faker } from '@faker-js/faker';
import { State, Subscription } from '@/payments/chargify/domain/types';

describe('Webhook Services', () => {
  let webhookService: WebhookService;
  let customersService: CustomersService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        CustomersModule,
        WebhookModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => {
              return {
                env: 'test',
                chargify: {
                  api_key: 'dummy_key',
                },
                afyLogger: {
                  url: 'dummy_url',
                },
                google: {
                  key: '{"key": 123}',
                },
                aws: {
                  msk: {
                    kafka: {
                      brokers: '',
                    },
                  },
                },
              };
            },
          ],
        }),
      ],
    }).compile();

    webhookService = module.get<WebhookService>(WebhookService);
    customersService = module.get<CustomersService>(CustomersService);
  });

  it('Should be defined', () => {
    expect(webhookService).toBeDefined();
  });

  function mockImplementationForStateChange() {
    jest
      .spyOn(webhookService, 'handleStateToActiveSubscription')
      .mockImplementation(async () => {
        return Promise.resolve();
      });
    jest
      .spyOn(webhookService, 'handleCancelSubscription')
      .mockImplementation(async () => {
        return Promise.resolve();
      });
    jest
      .spyOn(webhookService, 'handlePastDueorUnpaidSubscription')
      .mockImplementation(async () => {
        return Promise.resolve();
      });
    jest
      .spyOn(webhookService, 'chargifyWebhookActivity')
      .mockImplementation(async () => {
        return Promise.resolve();
      });
  }

  it('Should handle subscription state change to active, an inactive customer should to be updated to active', async () => {
    mockImplementationForStateChange();
    const email = faker.internet.email();
    const customer = await customersService.create(<CreateCustomerDto>{
      firstName: 'John',
      lastName: 'Doe',
      email,
      status: Status.INACTIVE,
    });

    const subscription = <Subscription>{
      id: 123,
      state: State.ACTIVE,
      previous_state: State.TRIALING,
      customer: {
        email,
      },
    };

    try {
      await webhookService.handleSubscriptionStateChange(subscription);
      expect(customersService.update).toBeCalled();

      const updatedCustomer = await customersService.findById(customer._id);
      expect(updatedCustomer.status).toEqual(Status.ACTIVE);
    } catch (error) {
      //
    }
  });

  it('Should handle subscription state change to canceled, an inactive customer should to be updated to inactive', async () => {
    mockImplementationForStateChange();
    const email = faker.internet.email();
    const customer = await customersService.create(<CreateCustomerDto>{
      firstName: 'John',
      lastName: 'Doe',
      email,
      status: Status.ACTIVE,
    });

    const subscription = <Subscription>{
      id: 123,
      state: State.CANCELED,
      previous_state: State.PAST_DUE,
      customer: {
        email,
      },
    };

    try {
      await webhookService.handleSubscriptionStateChange(subscription);
      expect(customersService.update).toBeCalled();

      const updatedCustomer = await customersService.findById(customer._id);
      expect(updatedCustomer.status).toEqual(Status.INACTIVE);
    } catch (error) {
      //
    }
  });
});

import { AfyPaymentsServices } from '@/integrations/afy-payments/afy-payments.services';
import { Test } from '@nestjs/testing';
import { CustomersService } from '@/customers/customers/customers.service';
import { rootMongooseTestModule } from '../../../test/utils/db.handler';
import { CustomersModule } from '@/customers/customers/customers.module';
import { ConfigModule } from '@nestjs/config';
import { AfyPaymentsModule } from '@/integrations/afy-payments/afy-payments.module';
import {
  SubscriptionPayload,
  WebhookPayload,
} from '@/payments/chargify/domain/types';
import { faker } from '@faker-js/faker';
import { DisService } from '@/legacy/dis/dis.service';
import { ProductsService } from '@/onboard/products/products.service';
import { ProductDocument } from '@/onboard/products/schemas/product.schema';
import { ObjectId } from 'mongodb';
import { Status } from '@/customers/customers/domain/types';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';

describe('Afy Payments Services', () => {
  let afyPaymentsService: AfyPaymentsServices;
  let customersServices: CustomersService;
  let paymentChargifyService: PaymentChargifyService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        AfyPaymentsModule,
        CustomersModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => {
              return {
                env: 'test',
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

    afyPaymentsService = module.get<AfyPaymentsServices>(AfyPaymentsServices);
    customersServices = module.get<CustomersService>(CustomersService);
    paymentChargifyService = module.get<PaymentChargifyService>(
      PaymentChargifyService,
    );
  });

  it('should be defined', () => {
    expect(afyPaymentsService).toBeDefined();
    expect(customersServices).toBeDefined();
    expect(paymentChargifyService).toBeDefined();
  });

  it('Should customer has active status after one time payment for ClickFunnels', async () => {
    jest
      .spyOn(DisService.prototype, 'syncDependencies')
      .mockImplementation(async () => {
        return Promise.resolve({
          hubspotId: '123',
        });
      });

    jest
      .spyOn(ProductsService.prototype, 'find')
      .mockImplementation(async () => {
        return Promise.resolve(<ProductDocument>{
          _id: new ObjectId(),
        });
      });

    jest
      .spyOn(paymentChargifyService, 'getComponentsFromSubscription')
      .mockResolvedValue([
        {
          component_id: 456,
          subscription_id: 0,
          allocated_quantity: 0,
          pricing_scheme: null,
          name: '',
          kind: '',
          unit_name: '',
          price_point_id: 0,
          price_point_handle: '',
          enabled: false,
        },
      ]);
    const email = faker.internet.email();
    const data = <WebhookPayload<SubscriptionPayload>>{
      payload: {
        subscription: {
          id: 123,
          customer: {
            email,
          },
          product: {
            id: '123',
            product_family: {
              handle: 'example_handle',
            },
          },
        },
      },
    };

    await afyPaymentsService.handleOneTimePaymentSuccessEvent(data);

    const customer = await customersServices.findByEmail(email);
    expect(customer).toBeDefined();
    expect(customer.status).toBe(Status.ACTIVE);
    expect(
      paymentChargifyService.getComponentsFromSubscription,
    ).toHaveBeenCalledWith(data.payload.subscription);
  });
});

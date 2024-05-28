import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentBehavior, Stripe } from './stripe';

describe('PAYMENT_GATEWAY', () => {
  let paymentGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        { provide: 'PAYMENT_GATEWAY', useClass: Stripe },
        { provide: 'STRIPE_SECRET_KEY', useValue: 'someKey' },
        {
          provide: 'PAYMENT_GATEWAY_SECRET_KEY',
          useValue: 'someKey',
        },
      ],
    }).compile();

    paymentGateway = module.get<Stripe>('PAYMENT_GATEWAY');
  });

  it('should be defined', () => {
    expect(paymentGateway).toBeDefined();
  });

  describe('buildSubscriptionObject', () => {
    it('should build a stripe subscription object', () => {
      const inputObject = {
        customerId: 'cus_12312fgsdf',
        products: [{ id: 'someId' }, { id: 'someId2' }],
        oneTimeProducts: [{ id: 'someId', quantity: 1 }],
        trialPeriod: 30,
        metadata: { fruit: 'apple' },
      };

      const expectedOutput = {
        customer: 'cus_12312fgsdf',
        items: [{ price: 'someId' }, { price: 'someId2' }],
        add_invoice_items: [{ price: 'someId', quantity: 1 }],
        payment_behavior: PaymentBehavior.defaultIncomplete,
        expand: ['latest_invoice.payment_intent'],
        trial_period_days: 30,
        metadata: { fruit: 'apple' },
        automatic_tax: {
          enabled: true,
        },
      };

      const result = paymentGateway.buildSubscriptionObject(inputObject);
      expect(result).toEqual(expectedOutput);
    });
  });
});

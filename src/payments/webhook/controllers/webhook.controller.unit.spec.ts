import { WebhookService } from '@/payments/webhook/webhook.service';
import AfyLoggerService from '@/integrations/afy-logger/afy-logger.service';
import { Logger } from '@nestjs/common';
import { WebhookController } from '@/payments/webhook/controllers/webhook.controller';
import {
  State,
  Subscription,
  SubscriptionPayload,
  WebhookPayload,
} from '@/payments/chargify/domain/types';
import { Response } from 'express';

describe('Webhook Controller', () => {
  let webhookController: WebhookController;
  let webhookService: WebhookService;
  let loggerServices: AfyLoggerService;
  let logger: Logger;

  beforeAll(() => {
    loggerServices = new AfyLoggerService(null);
    logger = new Logger();
    webhookService = new WebhookService(
      null,
      null,
      null,
      null,
      logger,
      null,
      null,
      null,
      null,
      null,
      loggerServices,
    );

    webhookController = new WebhookController(
      webhookService,
      loggerServices,
      logger,
    );
  });

  it('Should controller be defined', () => {
    expect(webhookController).toBeDefined();
  });

  it('Should payment-success call log new-trial', async () => {
    const subscription = <Subscription>{
      state: State.TRIALING,
      customer: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@doe.com',
      },
      product: {
        name: 'Product name',
        product_family: {
          handle: 'product_family_handle',
        },
      },
    };

    jest
      .spyOn(webhookService, 'handlePaymentSuccess')
      .mockImplementation(() => {
        return Promise.resolve({ message: 'ok' });
      });

    jest
      .spyOn(loggerServices, 'sendLogTrialConversion')
      .mockImplementation(() => Promise.resolve());

    await webhookController.paymentSuccess(<
      WebhookPayload<SubscriptionPayload>
    >{
      payload: {
        transaction: {
          kind: '...',
        },
        subscription,
      },
    });

    expect(loggerServices.sendLogTrialConversion).toBeCalled();
  });

  it('Should subscription-state-change call log become member', async () => {
    const subscription = <Subscription>{
      state: State.ACTIVE,
      previous_state: State.TRIALING,
      customer: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@doe.com',
      },
      product: {
        name: 'Product name',
        product_family: {
          handle: 'product_family_handle',
        },
      },
    };

    jest
      .spyOn(webhookService, 'handleSubscriptionStateChange')
      .mockImplementation(() => Promise.resolve());

    jest
      .spyOn(loggerServices, 'sendLogTrialConversion')
      .mockImplementation(() => Promise.resolve());

    await webhookController.subscriptionStateChange(
      <Response>{
        status: (n: number) => console.log(n),
      },
      <WebhookPayload<SubscriptionPayload>>{
        payload: {
          transaction: {
            kind: '...',
          },
          subscription,
        },
      },
    );

    expect(loggerServices.sendLogTrialConversion).toBeCalled();
  });
});

import { OnboardService } from '@/onboard/onboard.service';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
import {
  MetadataPaginationSchema,
  State,
  Subscription,
} from '@/payments/chargify/domain/types';
import AfyLoggerService from '@/integrations/afy-logger/afy-logger.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { OrderBookAndUpdateSessionDto } from '@/onboard/dto/order-book-and-update-session.dto';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { Logger } from '@nestjs/common';
import { CoachingDetails } from '@/onboard/domain/types';
import { OnboardController } from '@/onboard/controllers/onboard.controller';
import { SearchSuggestionsDto } from '@/onboard/dto/onboard-metrics.dto';

describe('Onboard Service', () => {
  let onboardService: OnboardService;
  let onboardController: OnboardController;
  let paymentChargifyService: PaymentChargifyService;
  let afyLoggerServices: AfyLoggerService;
  let hubspotService: HubspotService;
  let logger: Logger;

  beforeAll(() => {
    paymentChargifyService = new PaymentChargifyService(
      null,
      null,
      null,
      null,
      null,
    );

    afyLoggerServices = new AfyLoggerService(null);

    logger = new Logger();

    hubspotService = new HubspotService(null, null, null, null, logger, null);

    onboardService = new OnboardService(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      hubspotService,
      null,
      null,
      null,
      null,
      null,
      paymentChargifyService,
      null,
      null,
      null,
      null,
      null,
      afyLoggerServices,
      null,
      null,
    );
    onboardController = new OnboardController(
      onboardService,
      null,
      null,
      null,
      null,
    );
  });

  it('Should services be defined', () => {
    expect(onboardService).toBeDefined();
  });

  it('Should onboardservice.logBookOrderWhileTrial be called', async () => {
    jest
      .spyOn(paymentChargifyService, 'getOnlySubscriptionsFromCustomerEmail')
      .mockImplementation(() => {
        return Promise.resolve([
          <Subscription>{
            id: 123,
            state: State.TRIALING,
          },
        ]);
      });

    jest
      .spyOn(paymentChargifyService, 'getMetadataForResource')
      .mockImplementation(() => {
        return Promise.resolve(<MetadataPaginationSchema>{
          metadata: [
            {
              name: 'sessionId',
              value: '123',
            },
          ],
        });
      });

    jest.spyOn(afyLoggerServices, 'sendLog').mockImplementation(() => {
      return Promise.resolve();
    });

    await onboardService.logBookOrderWhileTrial(
      <CustomerDocument>{},
      <OrderBookAndUpdateSessionDto>{ sessionId: '123', quantity: 50 },
    );

    expect(afyLoggerServices.sendLog).toBeCalled();
  });

  it('Should add to queue', async () => {
    jest
      .spyOn(paymentChargifyService, 'getSubscriptionsFromEmail')
      .mockImplementation(() => {
        return Promise.resolve({
          id: 123,
          state: State.TRIALING,
        });
      });

    jest
      .spyOn(hubspotService, 'getDealBySubscriptionId')
      .mockImplementation(() => {
        return Promise.resolve({
          id: '1234',
          properties: {
            test: 'test',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

    jest
      .spyOn(onboardService, 'getCoachingHubspotDetails')
      .mockImplementation(() => {
        return Promise.resolve(<CoachingDetails>{
          marketing_consultant_owner: 'test',
          first_coaching_call_scheduled: 'test',
        });
      });

    jest.spyOn(hubspotService, 'updateDeal').mockImplementation(() => {
      return Promise.resolve({
        id: '1234',
        properties: {
          test: 'test',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    await onboardService.updateDealWithCoachDetails('test@email.com');

    expect(paymentChargifyService.getSubscriptionsFromEmail).toBeCalled();
    expect(hubspotService.getDealBySubscriptionId).toBeCalled();
    expect(onboardService.getCoachingHubspotDetails).toBeCalled();
    expect(hubspotService.updateDeal).toBeCalled();
  });

  it('Should onboardService.getSearchSuggestions be called', async () => {
    const expectedResult = ['test1', 'test2'];
    jest
      .spyOn(onboardService, 'getSearchSuggestions')
      .mockImplementation(() => {
        return Promise.resolve(expectedResult);
      });

    const result = await onboardController.getSearchSuggestions(<
      SearchSuggestionsDto
    >{
      'customerInfo.email': 'test',
    });

    expect(onboardService.getSearchSuggestions).toBeCalled();
    expect(result).toEqual(expectedResult);
  });
});

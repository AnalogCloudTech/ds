import { Injectable, Logger } from '@nestjs/common';
import { CustomersService } from '@/customers/customers/customers.service';
import {
  Customer,
  Metadata,
  SubscriptionComponent,
  SubscriptionPayload,
  WebhookPayload,
} from '@/payments/chargify/domain/types';
import { Status } from '@/customers/customers/domain/types';
import { ProductsService } from '@/onboard/products/products.service';
import { FilterQuery, Types } from 'mongoose';
import { ProductDocument } from '@/onboard/products/schemas/product.schema';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { HubspotSyncActionsServices } from '@/legacy/dis/legacy/hubspot/hubspot-sync-actions.services';
import { InjectQueue } from '@nestjs/bull';
import { HUBSPOT_SYNC_ACTIONS_QUEUE } from '@/legacy/dis/legacy/hubspot/constants';
import { JobOptions, Queue } from 'bull';
import { SessionDocument } from '@/onboard/schemas/session.schema';
import { SessionService } from '@/onboard/services/session.service';
import { OnboardService } from '@/onboard/onboard.service';
import { Step } from '@/onboard/domain/types';
import { HubspotSyncActionsDocument } from '@/legacy/dis/legacy/hubspot/schemas/hubspot-sync-actions.schema';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
import { CustomerEventsService } from '@/customers/customer-events/customer-events.service';
import { Events } from '@/customers/customer-events/domain/types';
import { first } from 'lodash';
import { DateTime } from 'luxon';
import { LineItemDto } from '@/legacy/dis/legacy/hubspot/dto/line-item.dto';
import { CustomerPropertiesService } from '@/customers/customer-properties/customer-properties.service';
import { LoggerPayload } from '@/internal/utils/logger';
import { CONTEXT_CHARGIFY_DEAL } from '@/internal/common/contexts';
import * as hubspot from '@hubspot/api-client';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { oneTimeProductFamilyHandles } from '@/onboard/products/domain/types';

@Injectable()
export class AfyPaymentsServices {
  constructor(
    private logger: Logger,
    private readonly customersService: CustomersService,
    private readonly customerEventsServices: CustomerEventsService,
    private readonly customerPropertiesServices: CustomerPropertiesService,
    private readonly productServices: ProductsService,
    private readonly hubspotServices: HubspotService,
    private readonly hubspotSyncActionsServices: HubspotSyncActionsServices,
    private readonly sessionServices: SessionService,
    private readonly onboardServices: OnboardService,
    private readonly paymentChargifyServices: PaymentChargifyService,
    @InjectQueue(HUBSPOT_SYNC_ACTIONS_QUEUE) private readonly queue: Queue,
  ) {}

  private parseCustomerDataFromSubscriptionPayload(customer: Customer) {
    return {
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
      status: Status.ACTIVE,
      billing: {
        address1: customer.address,
        city: customer.city,
        state: customer.state,
        country: customer.country,
        zip: customer.zip,
      },
      phone: customer.phone,
      attributes: null,
      smsPreferences: {
        schedulingCoachReminders: false,
      },
    };
  }

  private async enqueueHubspotSyncActionJob(
    syncAction: HubspotSyncActionsDocument,
    jobOptions: JobOptions = { delay: 1000 * 5 },
  ): Promise<void> {
    await this.queue.add(syncAction, jobOptions);
  }

  private async enqueueAddCreditsJob(email: string, credits: number) {
    const addBookCredits =
      await this.hubspotSyncActionsServices.addBookCreditsToCustomer(
        email,
        credits,
      );
    await this.enqueueHubspotSyncActionJob(addBookCredits);
  }

  private async enqueueEnrollContactToListJob(email: string, listId: number) {
    const enrollContactToList =
      await this.hubspotSyncActionsServices.enrollContactToList(email, listId);

    await this.enqueueHubspotSyncActionJob(enrollContactToList);
  }

  private async enqueueUpdateBookPackageJob(
    email: string,
    bookPackage: Array<string>,
  ) {
    const updateBookPackage =
      await this.hubspotSyncActionsServices.setBookPackages(email, bookPackage);
    await this.enqueueHubspotSyncActionJob(updateBookPackage);
  }

  private async findProduct(
    id: number | string,
  ): Promise<ProductDocument | null> {
    const productQuery: FilterQuery<ProductDocument> = {
      $or: [{ chargifyId: id }, { chargifyComponentId: id }],
    };
    return await this.productServices.find(productQuery);
  }

  public async handleOneTimePaymentSuccessEvent(
    data: WebhookPayload<SubscriptionPayload>,
  ) {
    const { customer: subscriptionCustomer, product: subscriptionProduct } =
      data.payload.subscription;

    const existentCustomer = await this.customersService.findOne({
      email: subscriptionCustomer.email,
    });

    await this.customersService.syncCustomer(
      this.parseCustomerDataFromSubscriptionPayload(subscriptionCustomer),
      Status.ACTIVE,
      existentCustomer,
    );
    const chargifyComponentId =
      await this.paymentChargifyServices.getComponentsFromSubscription(
        data.payload.subscription,
      );
    let componentId =
      chargifyComponentId?.length > 0
        ? chargifyComponentId[0].component_id
        : null;
    const familyHandle =
      data.payload.subscription.product.product_family.handle;

    if (oneTimeProductFamilyHandles.includes(familyHandle)) {
      componentId = +subscriptionProduct.id;
    }
    const productQuery: FilterQuery<ProductDocument> = {
      chargifyComponentId: componentId || subscriptionProduct.id,
    };
    const product = await this.productServices.find(productQuery);
    if (!product) {
      return;
    }

    const { email } = subscriptionCustomer;

    const promises: Array<Promise<void>> = [];

    if (product.creditsOnce) {
      promises.push(this.enqueueAddCreditsJob(email, product.creditsOnce));
    }

    if (product.hubspotListId) {
      promises.push(
        this.enqueueEnrollContactToListJob(email, product.hubspotListId),
      );
    }

    await Promise.all(promises);
  }

  private async activateCustomer(customer: CustomerDocument): Promise<void> {
    await this.customersService.update(customer, {
      status: Status.ACTIVE,
    });
  }

  public async handleUpsellOfferPaymentSuccessEvent(
    data: WebhookPayload<SubscriptionPayload>,
    offerMetadata: Metadata,
  ): Promise<SessionDocument> {
    const session = await this.handleNewSubscriptionWithoutSession(
      data,
      offerMetadata,
      Step.SCHEDULE_COACHING,
    );

    const customer = <CustomerDocument>session.customer;
    await this.activateCustomer(customer);

    return session;
  }

  public async handleDirectSalePaymentSuccessEvent(
    data: WebhookPayload<SubscriptionPayload>,
    offerMetadata: Metadata,
  ): Promise<SessionDocument> {
    const session = await this.handleNewSubscriptionWithoutSession(
      data,
      offerMetadata,
      Step.DONE,
    );

    const customer = <CustomerDocument>session.customer;
    await this.activateCustomer(customer);

    return session;
  }

  public async handleNewSubscriptionWithoutSession(
    data: WebhookPayload<SubscriptionPayload>,
    offerMetadata: Metadata,
    sessionDefaultStep: Step,
  ): Promise<SessionDocument> {
    const { subscription } = data.payload;
    const { customer: subscriptionCustomer } = subscription;

    const allocatedComponents =
      await this.paymentChargifyServices.getAllAllocatedComponentsFromSubscription(
        subscription,
      );

    const productComponent = first<SubscriptionComponent>(allocatedComponents);

    let existentCustomer = await this.customersService.findByEmail(
      subscriptionCustomer.email,
    );

    existentCustomer = await this.customersService.syncCustomer(
      this.parseCustomerDataFromSubscriptionPayload(subscriptionCustomer),
      Status.ACTIVE,
      existentCustomer,
    );

    let offer = await this.onboardServices.findOfferById(
      new Types.ObjectId(offerMetadata.value),
    );

    if (!offer) {
      return;
    }

    offer = await offer.populate(['products']);
    const offerProducts = <Array<ProductDocument>>offer.products;

    const session: SessionDocument =
      await this.sessionServices.startSessionForUpSell(
        offer,
        sessionDefaultStep,
        existentCustomer,
      );

    // move this to afy-payments
    await this.paymentChargifyServices.setMetadataForResource(
      'subscriptions',
      subscription.id,
      [
        {
          name: 'sessionId',
          value: <string>session._id,
        },
      ],
    );

    const { email } = subscriptionCustomer;

    if (offer.packages?.length) {
      await this.enqueueUpdateBookPackageJob(email, offer.packages);
    }

    if (offer?.hubspotListId) {
      await this.enqueueEnrollContactToListJob(email, offer.hubspotListId);
    }

    const product = offerProducts.find(
      (product: ProductDocument) =>
        Number(product.chargifyComponentId) === productComponent.component_id,
    );

    if (!product) {
      this.logger.error(
        {
          payload: <LoggerPayload>{
            context: CONTEXT_CHARGIFY_DEAL,
            usageDate: DateTime.now(),
            message: `Product not found for subscription ${subscription.id} and component ${productComponent.id}`,
            subscription,
          },
        },
        '',
        CONTEXT_CHARGIFY_DEAL,
      );
    }

    if (product) {
      if (product.creditsOnce) {
        await this.enqueueAddCreditsJob(email, product.creditsOnce);
      }

      if (product.hubspotListId) {
        await this.enqueueEnrollContactToListJob(email, product.hubspotListId);
      }
    }

    // create deal

    let createdDeal: hubspot.dealsModels.SimplePublicObject = null;
    try {
      const findExistingDeal =
        await this.hubspotServices.getDealBySubscriptionId(subscription.id);
      if (!findExistingDeal)
        createdDeal = await this.hubspotServices.createSubscriptionDeal(
          subscription,
          subscriptionCustomer,
          product,
          DateTime.now().toFormat('yyyy-LL-dd'),
          offer.title,
        );
      // create deal event
      await this.customerEventsServices.createEvent(existentCustomer, {
        event: Events.DEAL_CREATE,
        metadata: { createdDeal },
      });
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error({
          payload: <LoggerPayload>{
            usageDate: DateTime.now(),
            context: CONTEXT_CHARGIFY_DEAL,
            stack: error?.stack,
            error: error?.message,
            message: `Error creating deal for subscription ${subscription.id} and component ${productComponent.id}`,
          },
        });
      }
    }

    if (createdDeal) {
      try {
        await this.hubspotServices.associateDealToContact(
          existentCustomer.hubspotId,
          createdDeal.id,
        );
      } catch (error) {
        this.logger.error(
          `Error associating deal to contact ${existentCustomer.hubspotId}`,
          error,
        );

        // try to associate again later
        const createPropertyPayload = {
          customer: existentCustomer?._id,
          customerEmail: existentCustomer.email,
          module: 'onboard',
          value: 'association',
          name: 'Missing Association',
          metadata: { dealId: createdDeal.id },
        };

        await this.customerPropertiesServices.create(
          createPropertyPayload,
          existentCustomer,
        );
      }

      let hubspotProduct = await this.hubspotServices.findProductByChargifyId(
        product.chargifyComponentId,
      );

      if (!hubspotProduct) {
        try {
          hubspotProduct = await this.hubspotServices.createProduct({
            title: product.title,
            value: product.value,
            chargifyId: product.chargifyComponentId,
          });
        } catch (error) {
          if (error instanceof Error) {
            this.logger.error(
              {
                payload: <LoggerPayload>{
                  usageDate: DateTime.now(),
                  context: CONTEXT_CHARGIFY_DEAL,
                  stack: error?.stack,
                  error: error?.message,
                  message: `Error creating product ${
                    product.title
                  } - ${product._id.toString()}`,
                },
              },
              error?.stack,
              CONTEXT_CHARGIFY_DEAL,
            );
          }
        }
      }

      if (hubspotProduct) {
        const lineItemDto: LineItemDto = {
          name: hubspotProduct.properties.name,
          hs_product_id: hubspotProduct.id,
          quantity: '1',
        };

        const createdLineItem = await this.hubspotServices.createLineItem(
          lineItemDto,
        );

        await this.hubspotServices.associateLineItemToDeal(
          createdLineItem.id,
          createdDeal.id,
        );
      }
    }
    await session.populate(['customer']);
    return session;
  }
}

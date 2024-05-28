import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { FilterQuery, Types } from 'mongoose';
import {
  ClickFunnelsContact,
  ClickFunnelsContactInfo,
  ClickFunnelsPayload,
  Customer,
  InvoiceIssuedPayload,
  Metadata,
  MetadataPaginationSchema,
  ProductFamily,
  RenewalSuccessPayload,
  State,
  Subscription,
  SubscriptionComponent,
  SubscriptionPayload,
  SubscriptionUpdated,
  SubscriptionUpdatedComponentTypes,
  SubscriptionUpdatedPayload,
  Transaction,
  WebhookPayload,
} from '@/payments/chargify/domain/types';
import { first, get, isEmpty, isUndefined, map } from 'lodash';
import * as bcrypt from 'bcryptjs';
import { generate } from 'randomstring';
import * as hubspot from '@hubspot/api-client';
import { CustomerSubscriptionDocument } from '@/customers/customers/schemas/customer-subscription.schema';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { CustomersService } from '@/customers/customers/customers.service';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
import { ProductsService } from '@/onboard/products/products.service';
import {
  convertToHSDate,
  epochToHSDate,
  getDifferenceInDays,
} from '@/internal/common/utils/dateFormatters';
import { LineItemDto } from '@/legacy/dis/legacy/hubspot/dto/line-item.dto';
import { ProductDocument } from '@/onboard/products/schemas/product.schema';
import { DateTime } from 'luxon';
import { CmsService } from '@/cms/cms/cms.service';
import { OnboardService } from '@/onboard/onboard.service';
import { capitalizeFirstLetter } from '@/internal/utils/string';
import { SessionDocument } from '@/onboard/schemas/session.schema';
import {
  CONTEXT_CHARGIFY,
  CONTEXT_CLICKFUNNEL_LOG,
  CONTEXT_CRONJOB_HANDLE_FAILED_EVENTS,
  CONTEXT_ERROR,
  CONTEXT_HUBSPOT,
  CONTEXT_SUBSCRIPTION_UPDATE,
  CONTEXT_WEBHOOK_METRICS,
  INVOICE_ISSUED,
  RENEWAL_SUCCESS,
} from '@/internal/common/contexts';
import { LoggerPayload } from '@/internal/utils/logger';
import { CustomerEventsService } from '@/customers/customer-events/customer-events.service';
import { CreateCustomerEventDto } from '@/customers/customer-events/dto/create-customer-event.dto';
import { Events } from '@/customers/customer-events/domain/types';
import { PaymentsService } from '@/legacy/dis/legacy/payments/payments.service';
import {
  HubspotPriceProperty,
  HubspotProductProperty,
  Type as ProductType,
} from '@/onboard/products/domain/types';
import {
  DEAL_DEAL_CANCELLED_STAGE_ID,
  DEAL_DEAL_STAGE_ID,
} from '@/legacy/dis/legacy/hubspot/constants';
import { ContactV1 } from '@/legacy/dis/legacy/hubspot/domain/types';
import { Status } from '@/customers/customers/domain/types';
import { AfyNotificationsService } from '@/integrations/afy-notifications/afy-notifications.service';
import AfyLoggerService from '@/integrations/afy-logger/afy-logger.service';
import { ChargifyTransaction } from '@/payments/webhook/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { sleep } from '@/internal/utils/functions';
import { CustomerPropertiesService } from '@/customers/customer-properties/customer-properties.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly hubspotService: HubspotService,
    private readonly customersService: CustomersService,
    private readonly paymentChargify: PaymentChargifyService,
    private readonly productsService: ProductsService,
    private readonly logger: Logger,
    private readonly cmsService: CmsService,
    private readonly onboardService: OnboardService,
    private readonly customerEventsService: CustomerEventsService,
    private readonly stripeService: PaymentsService,
    private readonly afyNotificationsService: AfyNotificationsService,
    private readonly afyLoggerService: AfyLoggerService,
    private readonly customerPropertiesService: CustomerPropertiesService,
    private readonly paymentChargifyService: PaymentChargifyService,
  ) {}

  async handleSubscriptionStateChange(
    subscription: Subscription,
  ): Promise<void> {
    const state: State = get(subscription, ['state']);
    const customerEmail = get(subscription, ['customer', 'email']);

    await this.chargifyWebhookActivity(
      customerEmail,
      { event: Events.SUBSCRIPTION_STATE_CHANGE },
      subscription,
    );

    const customerStatus = state === 'active' ? Status.ACTIVE : Status.INACTIVE;

    try {
      const customer = await this.customersService.findByEmail(customerEmail);
      await this.customersService.update(customer, { status: customerStatus });
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          {
            payload: <LoggerPayload>{
              method: 'handleSubscriptionStateChange',
              usageDate: DateTime.now(),
              message: error?.message,
              error: error?.name,
              stack: error?.stack,
              customerEmail,
              customerStatus,
            },
          },
          error?.stack,
          CONTEXT_ERROR,
        );
      }
    }

    switch (state) {
      case State.ACTIVE:
        await this.handleStateToActiveSubscription(subscription);
        break;
      case State.CANCELED:
        await this.handleCancelSubscription(subscription);
        break;
      case State.PAST_DUE:
      case State.UNPAID:
        await this.handlePastDueorUnpaidSubscription(subscription);
        break;
      default:
        this.logger.error(`subscription invalid state: ${state}`);
        break;
    }
  }

  async handleStateToActiveSubscription(
    subscription: Subscription,
  ): Promise<void> {
    const subscriptionId = get(subscription, ['id']);
    const previousState = get(subscription, ['previous_state']);
    const state: State = get(subscription, ['state']);
    const customerEmail = get(subscription, ['customer', 'email']);
    const deal = await this.hubspotService.getDealBySubscriptionId(
      subscriptionId,
    );
    if (!deal) {
      throw new HttpException(
        {
          message:
            'There is no Deal for this customer on Hubspot. No changes made',
        },
        HttpStatus.OK,
      );
    }
    const dealId = get(deal, ['id']);
    const customer: Customer = subscription.customer;
    const allocatedComponents =
      await this.paymentChargify.getAllAllocatedComponentsFromSubscription(
        subscription,
      );
    this.logger.log(`allocatedComponents: ${allocatedComponents}`);
    if (!allocatedComponents?.length) {
      this.logger.log(
        {
          payload: <LoggerPayload>{
            customerEmail,
            menthod: 'handleStateToActiveSubscription',
            message: 'There is no allocated component for this subscription',
            usageDate: DateTime.now(),
            subscriptionId,
          },
        },
        CONTEXT_CHARGIFY,
      );

      throw new HttpException(
        {
          message:
            'There is no allocated component for this subscription, No changes made',
        },
        HttpStatus.NOT_MODIFIED,
      );
    }
    const componentDetails = first<SubscriptionComponent>(allocatedComponents);
    this.logger.log(`componentDetails: ${componentDetails}`);
    const chargifyProductId = get(componentDetails, ['component_id']);
    this.logger.log(`chargifyProductId: ${chargifyProductId}`);
    const product: ProductDocument =
      await this.productsService.findProductByChargifyId(
        chargifyProductId.toString(),
      );
    this.logger.log(`product: ${product}`);
    const propertyData = {
      properties: {
        status: this.hubspotService.translateStripeStatusToHubspot(state),
        dealname: this.hubspotService.createDealName(
          subscription,
          customer,
          product,
        ),
        next_recurring_date: convertToHSDate(
          subscription.current_period_ends_at,
        ),
        [product.productProperty ?? HubspotProductProperty.AUTHORIFY_PRODUCT]:
          product.title,
        [product.priceProperty ??
        HubspotPriceProperty.RECURRING_REVENUE_AMOUNT]:
          product.value?.toString(10),
        amount: product.value?.toString(10),
        dealstage: DEAL_DEAL_STAGE_ID,
      },
    };
    await this.customerSubscribeorUnSubscribe(subscription);
    if (previousState !== State.TRIALING) {
      await this.onboardService.handleBookCredit(product, subscription);
    }
    this.logger.log(
      {
        payload: <LoggerPayload>{
          dealId,
          propertyData,
          usageDate: DateTime.now(),
          message: 'Updating hubspot deals',
        },
      },
      CONTEXT_HUBSPOT,
    );
    const handleSubscriptionToActive = { propertyData, dealId };
    await this.chargifyWebhookActivity(
      customerEmail,
      { event: Events.DEAL_UPDATE },
      handleSubscriptionToActive,
    );
    await this.hubspotService.updateDeal(dealId, propertyData);
  }

  getCreditsPropertyName(productProperty: HubspotProductProperty) {
    return productProperty === HubspotProductProperty.DENTIST_PRODUCT
      ? 'dentist_guide_credits'
      : 'afy_book_credits';
  }

  async handleCancelSubscription(subscription: Subscription): Promise<void> {
    try {
      await this.afyLoggerService.sendLog({
        customer: {
          email: subscription.customer.email,
          name: `${subscription.customer.first_name} ${subscription.customer.last_name}`,
        },
        event: {
          name: 'subscription-canceled',
          namespace: 'subscription',
        },
        source: 'digital-services',
        trace: 'subscription-cancelled',
        tags: [
          `product_name:${subscription.product.name}`,
          `product_handle:${subscription.product.handle}`,
        ],
      });
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          {
            payload: <LoggerPayload>{
              method: 'handleCancelSubscription',
              usageDate: DateTime.now(),
              error,
            },
          },
          error?.stack,
          CONTEXT_ERROR,
        );
      }
    }

    /** Update HubSpot lifecycle & Deal */
    await this.handleDeleteSubscription(subscription);
    await this.customerSubscribeorUnSubscribe(subscription);
  }

  async handlePastDueorUnpaidSubscription(
    subscription: Subscription,
  ): Promise<void> {
    if (!subscription) {
      throw new HttpException(
        {
          message: "Couldn't find config object for Subscription",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const subscriptionId = get(subscription, ['id']);
    if (!subscriptionId) {
      throw new HttpException(
        {
          message: 'This Invoice charge has no subscription, No changes made',
        },
        HttpStatus.OK,
      );
    }
    const customerEmail = get(subscription, ['customer', 'email']);
    const deal = await this.hubspotService.getDealBySubscriptionId(
      subscriptionId,
    );
    this.logger.log(`deal: ${deal}`);

    if (!deal) {
      throw new HttpException(
        {
          message:
            'There is no Deal for this customer on Hubspot. No changes made',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const body = {
      properties: {
        status: 'Failed',
      },
    };
    const handleSubscriptionToPastdueorUnpaid = { body, deal };
    await this.chargifyWebhookActivity(
      customerEmail,
      { event: Events.DEAL_UPDATE },
      handleSubscriptionToPastdueorUnpaid,
    );
    await this.hubspotService.updateDeal(deal.id, body);
  }

  async handleExpireCard(subscription: Subscription) {
    this.logger.log(`subscription: ${subscription}`);
    const customerObject = get(subscription, ['customer']);
    const email = get(customerObject, ['email']);

    //Customer Event
    await this.chargifyWebhookActivity(
      email,
      { event: Events.EXPIRING_CARD },
      subscription,
    );

    this.logger.log(`email : ${email}`);
    const user = await this.hubspotService.getContactDetailsByEmail(email);
    const userId = user.vid.toString();
    this.logger.log(`HSuserId : ${userId}`);
    /** lifecyclestage property can only go one way therefore we set it to empty then set the value we need */
    const activeDeals = await this.hubspotService.findActiveDealsByEmail(email);
    const numberOfActiveDeals = activeDeals?.total;
    const lifeCycle = this.getCustomerLifeCycle(numberOfActiveDeals);

    const resetLifecycleStage = {
      properties: {
        lifecyclestage: '',
      },
      json: true,
    };

    const setLifecycleStage = {
      properties: {
        lifecyclestage: lifeCycle,
      },
      json: true,
    };

    /** Update contact lifecycle stage*/
    await this.hubspotService.updateContactById(userId, resetLifecycleStage);
    await this.hubspotService.updateContactById(userId, setLifecycleStage);

    const propertyData = {
      properties: {
        status: 'Expired',
      },
    };
    const dealData = get(activeDeals, ['results']);
    const expiredCard = { dealData, propertyData };
    await this.chargifyWebhookActivity(
      email,
      { event: Events.DEAL_UPDATE },
      expiredCard,
    );
    const promises = map(dealData, (deal) =>
      this.hubspotService.updateDeal(deal.id, propertyData),
    );
    await Promise.all(promises);

    return { Message: 'Deals updated successfully' };
  }

  async handleDeleteSubscription(subscription: Subscription) {
    const subscriptionId = get(subscription, ['id']);
    const newDate = new Date();
    const date = newDate.setUTCHours(0, 0, 0, 0);
    const deal = await this.hubspotService.getDealBySubscriptionId(
      subscriptionId,
    );
    const dealId = get(deal, ['id']);
    const customerEmail = get(subscription, ['customer', 'email']);
    const hubspotCustomer = await this.hubspotService.getContactDetailsByEmail(
      customerEmail,
    );
    const vid = hubspotCustomer.vid.toString();
    if (get(deal, 'properties.status') === 'duplicate') {
      return;
    }
    const activeDeals: hubspot.dealsModels.CollectionResponseWithTotalSimplePublicObjectForwardPaging =
      await this.hubspotService.findActiveDealsByEmail(customerEmail);
    const numberOfActiveDeals = activeDeals?.total;
    const lifeCycle = numberOfActiveDeals ? 'customer' : 'subscriber';

    /** lifecyclestage property can only go one way therefore we set it to empty then set the value we need */

    const resetLifecycleStage = {
      properties: {
        lifecyclestage: '',
      },
      json: true,
    };

    const setLifecycleStage = {
      properties: {
        lifecyclestage: lifeCycle,
      },
      json: true,
    };

    /** Update contact lifecycle stage*/
    await this.hubspotService.updateContactById(vid, resetLifecycleStage);
    await this.hubspotService.updateContactById(vid, setLifecycleStage);

    /** Update Deal  */

    const objectInput = {
      properties: {
        cancelled_date: date.toString(),
        status: 'Cancelled',
        dealstage: DEAL_DEAL_CANCELLED_STAGE_ID,
      },
    };
    const canceledSubscription = { objectInput, dealId };
    await this.chargifyWebhookActivity(
      customerEmail,
      { event: Events.DEAL_UPDATE },
      canceledSubscription,
    );
    await this.hubspotService.updateDeal(dealId, objectInput);
  }

  async handlePaymentFailure(
    body: WebhookPayload<SubscriptionPayload>,
  ): Promise<void> {
    const payload: SubscriptionPayload = get(body, ['payload']);
    const subscriptionObject = get(payload, ['subscription']);
    const transactionObject = get(payload, ['transaction']);
    if (!subscriptionObject) {
      throw new HttpException(
        {
          message: "Couldn't find config object for Subscription",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const customerObject = get(payload, ['subscription', 'customer']);

    const invoiceIds = get(transactionObject, ['invoice_uids']);
    const invoiceId = first(invoiceIds).toString();
    this.logger.log(`InvoiceId: ${invoiceId}`);

    const invoiceObject = await this.paymentChargify.getInvoiceByInvoiceId(
      invoiceId,
    );
    if (!invoiceObject) {
      throw new HttpException(
        {
          message: 'This charge has no invoice. No changes made',
        },
        HttpStatus.OK,
      );
    }
    const invoiceObjectJson = JSON.stringify(invoiceObject);
    this.logger.log({ invoiceObjectJson }, CONTEXT_CHARGIFY);

    const invoiceUrl: string = get(invoiceObject, ['public_url']);
    const email = get(customerObject, ['email']);

    //Customer Event
    await this.chargifyWebhookActivity(
      email,
      { event: Events.PAYMENT_FAILED },
      body,
    );

    this.logger.log(`invoiceUrl: ${invoiceUrl}`);

    const userId = await this.hubspotService.getContactDetailsByEmail(email);
    if (!userId) {
      throw new HttpException(
        {
          message:
            'There is no customer for that email on HubSpot. No changes made',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const subscriptionId = get(subscriptionObject, ['id']);
    if (!subscriptionId) {
      throw new HttpException(
        {
          message: 'This Invoice charge has no subscription, No changes made',
        },
        HttpStatus.OK,
      );
    }

    const deal = await this.hubspotService.getDealBySubscriptionId(
      subscriptionId,
    );
    this.logger.log(`deal: ${deal}`);

    if (!deal) {
      throw new HttpException(
        {
          message:
            'There is no Deal for this customer on Hubspot. No changes made',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // @TODO chargify apparently does not provides the reason of fail, for now, the we fixed the reason just with as a failed payment.
    const updatedDeal = {
      properties: {
        hold_payment_date: DateTime.now().toFormat('yyyy-LL-dd').toString(),
        failed_payment_reason: 'Payment failed',
        stripe_payment_page: invoiceUrl,
      },
    };
    const paymentFailure = { updatedDeal, deal };
    await this.chargifyWebhookActivity(
      email,
      { event: Events.DEAL_UPDATE },
      paymentFailure,
    );
    await this.hubspotService.updateDeal(deal.id, updatedDeal);

    // update session
    const event = body.event;
    const sessionId = <string>body.sessionId;
    const resourceMetaData = <MetadataPaginationSchema>body.resourceMetaData;

    this.logger.log({ resourceMetaData }, CONTEXT_CHARGIFY);
    const offerId =
      resourceMetaData && resourceMetaData.metadata.length
        ? resourceMetaData.metadata.find(
            (meta: Metadata) => meta?.name === 'offerId',
          )?.value
        : null;
    this.logger.log({ offerId }, CONTEXT_CHARGIFY);

    const message = subscriptionObject.last_payment_error?.message;
    this.logger.log({ message });

    let session: SessionDocument;

    this.logger.log({ event });

    this.logger.log('event: payment_failure updating session');
    if (sessionId && offerId) {
      session = await this.onboardService.registerPaymentFailure(
        sessionId,
        offerId,
        message,
      );
    }
    this.logger.log({ session });
    if (session) {
      await this.onboardService.updateStepAndPopulateSession(session);
    }
  }

  async customerSubscribeorUnSubscribe(
    subscription: Subscription,
  ): Promise<CustomerSubscriptionDocument> {
    const subscriptionId = get(subscription, ['id']).toString();
    const email = get(subscription, ['customer', 'email']);
    const subObjects = await this.paymentChargify.getSubscriptionBySubId(
      subscriptionId,
    );
    const status = get(subObjects, ['subscription', 'state']);
    const previousState = get(subObjects, ['subscription', 'previous_state']);
    return this.customersService.createSubscriptionorUnsubscription(
      email,
      subscriptionId,
      status,
      previousState,
    );
  }

  isAllocationIncreasing(previousAllocation: number, newAllocation: number) {
    return previousAllocation == 0 && newAllocation;
  }

  getCustomerLifeCycle(dealsCount: number) {
    return dealsCount ? 'customer' : 'subscriber';
  }

  getDealName(status: string, name: string, productName: string) {
    return status === 'trialing'
      ? `${name} - ${productName} - trialing`
      : `${name} - ${productName}`;
  }

  async handleSubscriptionUpdate(
    payload: SubscriptionUpdatedPayload,
  ): Promise<void> {
    const subscription = get(payload, ['subscription']);
    const component = get(payload, ['component']);
    const previous_allocation = get(payload, ['previous_allocation']);
    const new_allocation = get(payload, ['new_allocation']);

    const subscriptionId = subscription.id;
    const subObjects = await this.paymentChargify.getSubscriptionBySubId(
      subscriptionId.toString(),
    );
    const {
      customer,
      state: status,
      current_period_ends_at,
    } = subObjects.subscription;

    /* LOG */
    this.logger.log(
      {
        payload: <LoggerPayload>{
          method: 'handleSubscriptionUpdate',
          usageDate: DateTime.now(),
          subscription,
          component,
          previous_allocation,
          new_allocation,
        },
      },
      CONTEXT_SUBSCRIPTION_UPDATE,
    );
    if (component?.kind !== 'quantity_based_component') {
      throw new HttpException(
        {
          message: 'Kind is not quantity_based_component',
        },
        HttpStatus.OK,
      );
    }
    if (new_allocation == 0) {
      await this.rewiseDeAllocation(
        component,
        customer,
        current_period_ends_at,
        subscription,
      );
      throw new HttpException(
        {
          message: 'Component De-allocated successfully',
        },
        HttpStatus.OK,
      );
    }

    const productPriceId = component.id;
    /* LOG */
    this.logger.log(
      {
        payload: <LoggerPayload>{
          method: 'handleSubscriptionUpdate',
          usageDate: DateTime.now(),
          productPriceId,
        },
      },
      CONTEXT_SUBSCRIPTION_UPDATE,
    );

    const query: FilterQuery<ProductDocument> = {
      chargifyComponentId: productPriceId.toString(),
    };

    const productObj: ProductDocument = await this.productsService.find(query);
    if (!productObj) {
      throw new HttpException(
        {
          message: 'Chargify Product not found',
        },
        HttpStatus.OK,
      );
    }

    const customerEmail = get(subObjects, [
      'subscription',
      'customer',
      'email',
    ]);

    //Customer Event
    await this.chargifyWebhookActivity(
      customerEmail,
      { event: Events.SUBSCRIPTION_UPDATED },
      payload,
    );

    /* LOG */
    this.logger.log(
      {
        payload: <LoggerPayload>{
          method: 'handleSubscriptionUpdate',
          usageDate: DateTime.now(),
          subObjects,
        },
      },
      CONTEXT_SUBSCRIPTION_UPDATE,
    );

    if (!subObjects) {
      throw new HttpException(
        {
          message:
            'Could not get subscription details from chargify using subId',
        },
        HttpStatus.OK,
      );
    }

    /* LOG */
    this.logger.log(
      {
        payload: <LoggerPayload>{
          method: 'handleSubscriptionUpdate',
          usageDate: DateTime.now(),
          data: { customer, status, current_period_ends_at },
        },
      },
      CONTEXT_SUBSCRIPTION_UPDATE,
    );

    if (status === 'canceled') {
      throw new HttpException(
        {
          message: 'Returned due to canceled status',
        },
        HttpStatus.OK,
      );
    }
    const isComponentQuantityIncreasing = this.isAllocationIncreasing(
      previous_allocation,
      new_allocation,
    );
    if (isComponentQuantityIncreasing) {
      const newStatus = status;
      const { email } = customer;
      const user = await this.hubspotService.getContactDetailsByEmail(email);
      const userId = user.vid.toString();
      const name =
        get(customer, ['first_name']) + ' ' + get(customer, ['last_name']);
      /* LOG */
      this.logger.log(
        {
          payload: <LoggerPayload>{
            method: 'handleSubscriptionUpdate',
            usageDate: DateTime.now(),
            data: { email, userId },
          },
        },
        CONTEXT_SUBSCRIPTION_UPDATE,
      );

      if (productObj.type === ProductType.ONE_TIME) {
        const creditsPropertyName = this.getCreditsPropertyName(
          productObj.productProperty,
        );
        const existingBookCredit = Number(
          get(user, ['properties', creditsPropertyName, 'value'], 0),
        );
        const newBookCredit =
          existingBookCredit + Number(productObj.creditsOnce);
        const reqBody = {
          properties: {
            [creditsPropertyName]: newBookCredit.toString(),
          },
        };
        const webhookBookCredit = {
          newBookCredit,
          existingBookCredit,
          reqBody,
        };
        await this.chargifyWebhookActivity(
          email,
          { event: Events.BOOK_CREDITS_ADD },
          webhookBookCredit,
        );

        await this.hubspotService.updateContactById(userId, reqBody);
      }
      const subObjects = await this.paymentChargify.getSubscriptionBySubId(
        subscriptionId.toString(),
      );
      if (productObj?.upgradeDowngrade) {
        const reqBodyData = await this.getPackageCreditsData(
          user,
          productObj,
          subObjects?.subscription,
          subscription,
        );
        const updateCreditsData = await Promise.all([
          // TODO: Implement sending email with appropriate content design
          // this.sendEmail(email),
          this.hubspotService.updateContactById(userId, reqBodyData),
        ]);
        /* LOG */
        this.logger.log(
          {
            payload: <LoggerPayload>{
              customerEmail,
              method: 'handleSubscriptionUpdate',
              usageDate: DateTime.now(),
              subscriptionId: subscription.id,
              reqBodyData,
              updateCreditsData,
            },
          },
          CONTEXT_SUBSCRIPTION_UPDATE,
        );
      }

      const deal = await this.hubspotService.getDealBySubscriptionId(
        subscription.id,
      );
      /* LOG */
      this.logger.log(
        {
          payload: <LoggerPayload>{
            customerEmail,
            method: 'handleSubscriptionUpdate',
            usageDate: DateTime.now(),
            subscriptionId: subscription.id,
            deal,
          },
        },
        CONTEXT_SUBSCRIPTION_UPDATE,
      );

      if (!deal) {
        throw new HttpException(
          {
            message:
              'There is no Deal for this customer on Hubspot. No changes made',
          },
          HttpStatus.OK,
        );
      }
      const dealId = get(deal, ['id']);
      /* LOG */
      this.logger.log(
        {
          payload: <LoggerPayload>{
            customerEmail,
            method: 'handleSubscriptionUpdate',
            usageDate: DateTime.now(),
            dealId,
          },
        },
        CONTEXT_SUBSCRIPTION_UPDATE,
      );

      /** lifecyclestage property can only go one way therefore we set it to empty then set the value we need */
      const activeDeals: hubspot.dealsModels.CollectionResponseWithTotalSimplePublicObjectForwardPaging =
        await this.hubspotService.findActiveDealsByEmail(email);
      const numberOfActiveDeals = activeDeals?.total;
      const lifeCycle = this.getCustomerLifeCycle(numberOfActiveDeals);

      const resetLifecycleStage = {
        properties: {
          lifecyclestage: '',
        },
        json: true,
      };
      /* LOG */
      this.logger.log(
        {
          payload: <LoggerPayload>{
            customerEmail,
            method: 'handleSubscriptionUpdate',
            usageDate: DateTime.now(),
            resetLifecycleStage,
          },
        },
        CONTEXT_SUBSCRIPTION_UPDATE,
      );
      const setLifecycleStage = {
        properties: {
          lifecyclestage: lifeCycle,
        },
        json: true,
      };
      /* LOG */
      this.logger.log(
        {
          payload: <LoggerPayload>{
            customerEmail,
            method: 'handleSubscriptionUpdate',
            usageDate: DateTime.now(),
            setLifecycleStage,
          },
        },
        CONTEXT_SUBSCRIPTION_UPDATE,
      );

      /** Update contact lifecycle stage*/
      await this.hubspotService.updateContactById(userId, resetLifecycleStage);
      await this.hubspotService.updateContactById(userId, setLifecycleStage);

      //Updating body details in deal
      const next_recurring_date = convertToHSDate(current_period_ends_at);
      const dealStatus: string = capitalizeFirstLetter(newStatus);
      const body = {
        properties: {
          dealname: this.getDealName(status, name, productObj.title),
          amount: productObj.value.toString(10),
          status: dealStatus,
          [productObj.productProperty ??
          HubspotProductProperty.AUTHORIFY_PRODUCT]: productObj.product,
          [productObj.priceProperty ??
          HubspotPriceProperty.RECURRING_REVENUE_AMOUNT]:
            productObj.value.toString(10),
          next_recurring_date: next_recurring_date,
        },
      };
      const subscriptionUpdated = { body, dealId };
      /* LOG */
      this.logger.log(
        {
          payload: <LoggerPayload>{
            customerEmail,
            method: 'handleSubscriptionUpdate',
            usageDate: DateTime.now(),
            dealId,
            body,
          },
        },
        CONTEXT_SUBSCRIPTION_UPDATE,
      );
      await this.chargifyWebhookActivity(
        customerEmail,
        { event: Events.DEAL_UPDATE },
        subscriptionUpdated,
      );
      await this.hubspotService.updateDeal(dealId, body);

      const associationsResult = await this.hubspotService.getDealsAssociation(
        dealId,
      );
      const associations = get(associationsResult, ['results']);
      await Promise.all(
        associations.map(async (association) => {
          await this.hubspotService.deleteAssociation(dealId, association.id);
        }),
      );

      const hubspotProduct = await this.hubspotService.createOrUpdateProduct(
        productPriceId.toString(),
        productObj,
      );
      /* LOG */
      this.logger.log(
        {
          payload: <LoggerPayload>{
            customerEmail,
            method: 'handleSubscriptionUpdate',
            usageDate: DateTime.now(),
            hubspotProduct,
          },
        },
        CONTEXT_SUBSCRIPTION_UPDATE,
      );

      const lineItemDto: LineItemDto = {
        name: hubspotProduct.properties.name,
        hs_product_id: hubspotProduct.id,
        quantity: '1',
      };
      /* LOG */
      this.logger.log(
        {
          payload: <LoggerPayload>{
            customerEmail,
            method: 'handleSubscriptionUpdate',
            usageDate: DateTime.now(),
            lineItemDto,
          },
        },
        CONTEXT_SUBSCRIPTION_UPDATE,
      );

      const createdLineItem = await this.hubspotService.createLineItem(
        lineItemDto,
      );
      /* LOG */
      this.logger.log(
        {
          payload: <LoggerPayload>{
            customerEmail,
            method: 'handleSubscriptionUpdate',
            usageDate: DateTime.now(),
            createdLineItem,
          },
        },
        CONTEXT_SUBSCRIPTION_UPDATE,
      );
      await this.hubspotService.associateLineItemToDeal(
        createdLineItem.id,
        dealId,
      );

      /* LOG */
      this.logger.log(
        {
          payload: <LoggerPayload>{
            method: 'handleSubscriptionUpdate',
            usageDate: DateTime.now(),
            message: `Deal Updated & Association created & Execution Completed`,
          },
        },
        CONTEXT_SUBSCRIPTION_UPDATE,
      );
      /* LOG */
      this.logger.log(
        {
          payload: <LoggerPayload>{
            customerEmail,
            method: 'handleSubscriptionUpdate',
            usageDate: DateTime.now(),
            message: 'Successfully handled book credits.',
          },
        },
        CONTEXT_SUBSCRIPTION_UPDATE,
      );
    }
  }

  async rewiseDeAllocation(
    component: SubscriptionUpdatedComponentTypes,
    customer: Customer,
    current_period_ends_at: string,
    subscription: SubscriptionUpdated,
  ) {
    const subObjects = await this.paymentChargify.getSubscriptionBySubId(
      subscription.id.toString(),
    );
    const chargifyComponentId = component.id;
    const query: FilterQuery<ProductDocument> = {
      chargifyComponentId: chargifyComponentId.toString(),
    };

    const productObj: ProductDocument = await this.productsService.find(query);
    if (!productObj) {
      throw new HttpException(
        {
          message: 'For Book Credits reduce - Chargify Product not found',
        },
        HttpStatus.OK,
      );
    }
    const { email } = customer;
    const user = await this.hubspotService.getContactDetailsByEmail(email);
    const userId = user.vid.toString();
    const previousState = get(subObjects, ['subscription', 'previous_state']);
    if (
      productObj?.upgradeDowngrade &&
      productObj?.creditsRecur &&
      previousState !== State.TRIALING
    ) {
      const reqBodyData = this.getCreditsReduceData(
        user,
        productObj,
        current_period_ends_at,
        subscription,
      );
      await this.hubspotService.updateContactById(userId, reqBodyData);
    }
  }

  async sendEmail(email: string) {
    const htmlData = await this.cmsService.getUpgradeNowTermsConfig();
    const emailMessage = {
      from: 'noreply@authorify.com',
      to: email,
      subject: 'Authorify Terms and Condition',
      html: htmlData,
      provider: 'aws',
    };
    return this.afyNotificationsService.sendEmail([emailMessage]);
  }

  async getPackageCreditsData(
    user: ContactV1,
    productObj: ProductDocument,
    subscription: Subscription,
    upateSubscription: SubscriptionUpdated,
  ) {
    const reqBody = {
      properties: {},
    };
    const creditsPropertyName = this.getCreditsPropertyName(
      productObj.productProperty,
    );
    let existingBookCredit = Number(
      get(user, ['properties', creditsPropertyName, 'value'], 0),
    );
    if (
      subscription?.product?.id.toString() ===
        upateSubscription?.product?.id.toString() &&
      subscription?.previous_state !== State.TRIALING
    ) {
      const reqBodyData = this.getCreditsReduceData(
        user,
        productObj,
        subscription?.current_period_ends_at,
        upateSubscription,
      );
      const hubspotData = await this.hubspotService.updateContactById(
        user.vid.toString(),
        reqBodyData,
      );
      existingBookCredit = Number(
        get(hubspotData, ['properties', creditsPropertyName], 0),
      );
    }

    if (productObj?.bookPackages) {
      reqBody.properties['afy_package'] = productObj.bookPackages;
    }
    if (productObj?.product) {
      reqBody.properties['authorify_saas_product'] = productObj.product;
    }
    if (productObj?.creditsRecur) {
      const newBookCredit =
        existingBookCredit + Number(productObj.creditsRecur);

      reqBody.properties[creditsPropertyName] = newBookCredit;
    }
    return reqBody;
  }

  getCreditsReduceData(
    user: ContactV1,
    productObj: ProductDocument,
    current_period_ends_at: string,
    subscription: SubscriptionUpdated,
  ) {
    const { interval_unit } = subscription.product;
    const currentPlanInterval = <string>(
      (interval_unit === 'month' ? 'monthly' : 'anually')
    );
    const reqBody = {
      properties: {},
    };

    if (productObj?.creditsRecur) {
      const upcomingDaysCount = getDifferenceInDays(current_period_ends_at);
      const perDay =
        currentPlanInterval === 'monthly'
          ? productObj?.creditsRecur / 30
          : productObj?.creditsRecur / 365;
      const toBeReduceCredits = Math.ceil(upcomingDaysCount * perDay);
      const creditsPropertyName = this.getCreditsPropertyName(
        productObj.productProperty,
      );
      const existingBookCredit = Number(
        get(user, ['properties', creditsPropertyName, 'value'], 0),
      );

      const newBookCredit =
        Number(existingBookCredit) - Number(toBeReduceCredits);

      reqBody.properties[creditsPropertyName] =
        newBookCredit > 0 ? newBookCredit : 0;
    }
    return reqBody;
  }

  async updateCustomerLifeCycle(
    email: string,
    stage = 'customer',
  ): Promise<void> {
    /* LOG */
    this.logger.log(
      {
        payload: <LoggerPayload>{
          email,
          method: 'updateCustomerLifeCycle',
          usageDate: DateTime.now(),
          stage,
        },
      },
      CONTEXT_HUBSPOT,
    );

    const hubspotCustomer = await this.hubspotService.getContactDetailsByEmail(
      email,
    );
    /* LOG */
    this.logger.log(
      {
        payload: <LoggerPayload>{
          email,
          method: 'updateCustomerLifeCycle',
          usageDate: DateTime.now(),
          hubspotCustomer,
        },
      },
      CONTEXT_HUBSPOT,
    );
    const vid = hubspotCustomer.vid.toString();

    const hubspotPayload = {
      properties: {
        lifecyclestage: stage,
      },
    };
    /* LOG */
    this.logger.log(
      {
        payload: <LoggerPayload>{
          email,
          method: 'updateCustomerLifeCycle',
          usageDate: DateTime.now(),
          vid,
          hubspotPayload,
        },
      },
      CONTEXT_HUBSPOT,
    );

    await this.hubspotService.updateContactById(vid, hubspotPayload);
  }

  async verifyRmmSubscription(
    body: WebhookPayload<SubscriptionPayload>,
  ): Promise<{ message: string }> {
    const { reference, payload } = body;
    const referralMarketingPlans: string[] =
      await this.cmsService.getReferralMarketingPlans();
    const {
      subscription,
    }: {
      subscription: Subscription;
    } = payload;
    const customerEmail: string = get(subscription, ['customer', 'email']);

    this.logger.log(
      {
        payload: <LoggerPayload>{
          email: customerEmail,
          method: 'verifyRmmSubscription',
          usageDate: DateTime.now(),
          subscription,
        },
      },
      CONTEXT_WEBHOOK_METRICS,
    );

    const currentSubscriptionProductFamily = <ProductFamily>(
      get(subscription, 'product.product_family', {})
    );

    const isReferralMarketingPlan = referralMarketingPlans.includes(
      currentSubscriptionProductFamily.handle,
    );

    const currentCreditCardCurrentVault = <string>(
      get(subscription, 'credit_card.current_vault', '')
    );

    const isStripeSubscription =
      currentCreditCardCurrentVault === 'stripe_connect';

    this.logger.log(
      { isReferralMarketingPlan, isStripeSubscription },
      CONTEXT_CHARGIFY,
    );
    if (subscription) {
      await this.customerSubscribeorUnSubscribe(subscription);
    }
    if (isStripeSubscription) {
      try {
        this.logger.log(
          {
            payload: <LoggerPayload>{
              email: customerEmail,
              method: 'stripe subscription, initiating deal creation',
              usageDate: DateTime.now(),
              isStripeSubscription,
            },
          },
          CONTEXT_WEBHOOK_METRICS,
        );
        await this.handlePaymentSuccess(body);
      } catch (exception) {
        this.logger.log({ exception });
        throw new HttpException(
          { message: 'There was some issue. please try again.' },
          HttpStatus.OK,
        );
      }
      return null;
    }

    // early return if the plan is other then the rmm-marketing
    if (!isReferralMarketingPlan) return null;

    await this.chargifyWebhookActivity(
      customerEmail,
      { event: Events.VERIFY_RMM_SUBSCRIPTION },
      payload,
    );

    try {
      await this.onboardService.createHubspotDeal(
        reference as number,
        subscription,
        subscription.created_at,
      );

      await this.updateCustomerLifeCycle(customerEmail);
      const randomString: string = generate(8);
      const encryptedPassword: string = await bcrypt.hash(randomString, 10);

      const packages = await this.hubspotService.getMergedPackages(
        customerEmail,
        ['RM Only'],
      );

      const hubspotDto = {
        email: customerEmail,
        afy_password: randomString,
        afy_password_encrypted: encryptedPassword,
        afy_package: packages,
        afy_customer_status: 'Active',
      };
      await this.hubspotService.createOrUpdateContact(hubspotDto);
      return { message: 'Subscription created successfully' };
    } catch (exception) {
      this.logger.log({ exception });
      throw new HttpException(
        { message: 'There was some issue. please try again.' },
        HttpStatus.OK,
      );
    }
  }

  async invoiceIssued(body: WebhookPayload<InvoiceIssuedPayload>) {
    const invoiceId = body.payload.invoice?.uid || null;
    if (isEmpty(invoiceId)) {
      this.logger.log(
        {
          payload: <LoggerPayload>{
            message: 'No Invoice id found in payload body',
            usageDate: DateTime.now(),
          },
        },
        INVOICE_ISSUED,
      );
      return null;
    }
    const invoiceObject = await this.paymentChargify.getInvoiceByInvoiceId(
      invoiceId,
    );
    if (isEmpty(invoiceObject)) {
      this.logger.log(
        {
          payload: <LoggerPayload>{
            message: 'No Invoice object found in chargify using uid',
            usageDate: DateTime.now(),
          },
        },
        INVOICE_ISSUED,
      );
      return null;
    }
    const customerEmail = invoiceObject?.customer?.email || null;
    if (isEmpty(customerEmail)) {
      this.logger.log(
        {
          payload: <LoggerPayload>{
            message: 'There is no customer email address found',
            usageDate: DateTime.now(),
          },
        },
        INVOICE_ISSUED,
      );
      return null;
    }
    const reqObject = {
      recipient_emails: [customerEmail],
    };
    await this.paymentChargify.sendInvoice(invoiceId, reqObject);
  }

  async renewalSuccess(
    body: WebhookPayload<RenewalSuccessPayload>,
  ): Promise<void> {
    try {
      const { payload } = body;
      const { subscription } = payload;
      const allocatedComponents =
        await this.paymentChargify.getAllAllocatedComponentsFromSubscription(
          subscription,
        );
      const componentDetails =
        first<SubscriptionComponent>(allocatedComponents);
      const isRecurring =
        componentDetails !== undefined && componentDetails.recurring;
      if (!isRecurring) {
        this.logger.log({
          payload: <LoggerPayload>{
            message: 'Component is not recurring',
            customer: {
              email: subscription.customer.email,
              name: subscription.customer.first_name,
            },
            usageDate: DateTime.now(),
            email: subscription.customer.email,
            componentDetails,
          },
          RENEWAL_SUCCESS,
        });
        return null;
      }
      const chargifyProductId = get(componentDetails, ['component_id']);
      /* LOG */
      this.logger.log(
        {
          payload: <LoggerPayload>{
            email: subscription.customer.email,
            method: 'renewalSuccess',
            usageDate: DateTime.now(),
            allocatedComponents,
            componentDetails,
          },
        },
        RENEWAL_SUCCESS,
      );

      let productDetails = await this.productsService.findProductByChargifyId(
        chargifyProductId.toString(),
      );

      const metaData = await this.paymentChargify.getMetadataForResource(
        'subscriptions',
        subscription.id,
      );
      const { metadata } = metaData;

      if (metadata.length > 0) {
        const offerMetadata = metadata.find((meta) => meta.name === 'offerId');
        if (offerMetadata) {
          let offer = await this.onboardService.findOfferById(
            new Types.ObjectId(offerMetadata.value),
          );

          if (offer) {
            offer = await offer.populate(['products']);

            const offerProducts = <Array<ProductDocument>>offer.products;
            const offerProduct = offerProducts?.find(
              (product) =>
                product.chargifyComponentId ===
                componentDetails.component_id.toString(),
            );

            if (offerProduct) {
              productDetails = offerProduct;
            }
          }
        }
      }
      /* LOG */
      this.logger.log(
        {
          payload: <LoggerPayload>{
            email: subscription.customer.email,
            method: 'renewalSuccess',
            usageDate: DateTime.now(),
            productDetails,
            message: 'Start updating book credit',
          },
        },
        RENEWAL_SUCCESS,
      );
      const intervalUnit = get(subscription, ['product', 'interval_unit']);
      if (
        intervalUnit === 'month' &&
        productDetails?.creditsOnce > 0 &&
        productDetails?.creditsRecur == 0
      ) {
        const queryParams = {
          kinds: 'payment',
        };
        this.logger.log(
          {
            payload: <LoggerPayload>{
              email: subscription.customer.email,
              method: 'getAllTransactionBySubscriptionId',
              usageDate: DateTime.now(),
              subscription,
              productDetails,
              message: 'Start updating annual credit once',
            },
          },
          RENEWAL_SUCCESS,
        );
        await this.getAllTransactionBySubscriptionId(
          subscription,
          queryParams,
          productDetails?.creditsOnce,
          productDetails?.productProperty,
          50,
          1,
        );
      }
      await this.onboardService.handleBookCredit(productDetails, subscription);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error({
          payload: <LoggerPayload>{
            usageDate: DateTime.now(),
            context: `${RENEWAL_SUCCESS}`,
            stack: error?.stack,
            error: error?.message,
            message: 'Something went wrong during renewal success webhook',
          },
        });
        throw new HttpException(
          {
            message: 'Something went wrong during renewal success webhook',
            error: error?.message,
            name: error?.name,
            stack: error?.stack,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getAllTransactionBySubscriptionId(
    subscription: Subscription,
    queryParams: object,
    newCredits: number,
    productProperty: HubspotProductProperty,
    perPage = 50,
    page = 1,
  ): Promise<void> {
    if (!subscription) {
      throw new HttpException(
        {
          message: 'Subscription is required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const subscriptionId = get(subscription, ['id']);
    const url = `subscriptions/${subscriptionId}/transactions.json/?per_page=${perPage}&page=${page}`;
    const email = get(subscription, ['customer', 'email']);
    const response: ChargifyTransaction[] = await this.paymentChargify.find(
      url,
      queryParams,
    );
    let count = 0;

    for (const data of response) {
      const transaction = data?.transaction?.memo.includes(
        `${subscription?.customer?.first_name} ${subscription?.customer?.last_name} - ${subscription?.product?.name}: Renewal payment`,
      );

      if (transaction) {
        count++;
      }
    }
    const isRenewed = count % 12 == 0;
    this.logger.log(
      {
        payload: <LoggerPayload>{
          email,
          method: 'getAllTransactionBySubscriptionId',
          usageDate: DateTime.now(),
          count,
          isRenewed,
        },
      },
      RENEWAL_SUCCESS,
    );
    if (isRenewed) {
      // Set the count to 12 if it's a multiple of 12
      count = 12;
    }
    if (count == 12) {
      const user = await this.hubspotService.getContactDetailsByEmail(email);
      const userId = user.vid.toString();
      const creditsPropertyName = this.getCreditsPropertyName(productProperty);
      const existingBookCredit = Number(
        get(user, ['properties', creditsPropertyName, 'value'], 0),
      );
      const newBookCredit = existingBookCredit + newCredits;
      const reqBody = {
        properties: {
          [creditsPropertyName]: newBookCredit.toString(),
        },
      };
      const hubspotData = await this.hubspotService.updateContactById(
        userId,
        reqBody,
      );
      this.logger.log(
        {
          payload: <LoggerPayload>{
            method: 'getAllTransactionBySubscriptionId',
            usageDate: DateTime.now(),
            hubspotData,
            email,
          },
        },
        RENEWAL_SUCCESS,
      );
    }
  }
  async isReferalMarketingPlan(
    subscription: Subscription,
    transaction: Transaction,
  ): Promise<boolean> {
    const referralMarketingPlans: string[] =
      await this.cmsService.getReferralMarketingPlans();
    const currentSubscriptionProductFamily =
      subscription?.product?.product_family;
    const dateFormat = 'yyyy-MM-dd';
    const isReferralMarketingPlan = referralMarketingPlans.includes(
      currentSubscriptionProductFamily.handle,
    );
    const transactionCretaedAt = DateTime.fromISO(
      transaction?.created_at,
    ).toFormat(dateFormat);
    const subscriptionCreatedAt = DateTime.fromISO(
      subscription?.created_at,
    ).toFormat(dateFormat);
    return (
      isReferralMarketingPlan && transactionCretaedAt === subscriptionCreatedAt
    );
  }
  async handlePaymentSuccess(body: WebhookPayload<SubscriptionPayload>) {
    const { id: reference, payload } = body;
    const sessionId = <string>body.sessionId;
    const resourceMetaData = <MetadataPaginationSchema>body.resourceMetaData;
    const { subscription, transaction, event_id: eventId } = payload;
    this.logger.log({ subscription }, CONTEXT_CHARGIFY);
    this.logger.log({ resourceMetaData }, CONTEXT_CHARGIFY);

    const offerId =
      resourceMetaData && resourceMetaData.metadata.length
        ? resourceMetaData.metadata.find(
            (meta: Metadata) => meta?.name === 'offerId',
          )?.value
        : null;
    this.logger.log({ offerId });

    const subscriptionCustomer = subscription.customer;
    const customerEmail = get(subscriptionCustomer, ['email']);
    const user = await this.customersService.findByEmail(customerEmail);
    if (!user?._id) {
      const randomString: string = generate(8);
      const createUserDto = {
        firstName: subscriptionCustomer.first_name,
        lastName: subscriptionCustomer.last_name,
        email: customerEmail,
        chargifyId: get(subscription, ['customer', 'id']),
        status: 'active',
        billing: {
          address1: subscriptionCustomer.address,
          city: subscriptionCustomer.city,
          state: subscriptionCustomer.state,
          country: subscriptionCustomer.country,
          zip: subscriptionCustomer.zip,
        },
        phone: subscriptionCustomer.phone,
        password: randomString,
        attributes: null,
        smsPreferences: {
          schedulingCoachReminders: false,
        },
      };
      await this.customersService.create(createUserDto);
    }

    if (user.status !== Status.ACTIVE) {
      // Force change the status to active
      await this.customersService.update(user, { status: Status.ACTIVE });
    }

    const isReferralMarketingPlan = await this.isReferalMarketingPlan(
      subscription,
      transaction,
    );
    if (isReferralMarketingPlan) {
      return { message: 'Not create a deal for referral marketing plan' };
    }
    //Customer Event
    await this.chargifyWebhookActivity(
      customerEmail,
      { event: Events.PAYMENT_SUCCESS },
      body,
    );

    // @ts-expect-error transaction is wrongly typed, not fixing this now...
    await this.paymentChargifyService.createPaymentStatus(transaction);

    let session: SessionDocument;

    try {
      if (sessionId) {
        const { properties } = await this.onboardService.createHubspotDeal(
          eventId,
          subscription,
          transaction.created_at,
          transaction?.component_id,
          sessionId,
        );
        await this.chargifyWebhookActivity(
          customerEmail,
          { event: Events.DEAL_CREATE },
          properties,
        );
        await this.onboardService.updateCustomerSocialMediaTraining(properties);
        await this.updateCustomerLifeCycle(customerEmail);
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          {
            payload: <LoggerPayload>{
              usageDate: DateTime.now(),
              customer: {
                email: customerEmail,
              },
              method: 'WebhookServices@handlePaymentSuccess',
              message: 'dealCreation',
              error: error?.message,
              stack: error?.stack,
            },
          },
          error?.stack,
          CONTEXT_ERROR,
        );
      }
    }

    try {
      if (sessionId && offerId) {
        const paymentDetails = await this.onboardService.getPaymentDetails({
          sessionId,
          offerId,
        });
        if (!paymentDetails) {
          session = await this.onboardService.registerPaymentSuccess(
            sessionId,
            offerId,
            reference.toString(10),
            customerEmail,
          );
        }
      }

      if (session) {
        await this.onboardService.updateStepAndPopulateSession(session);
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          {
            payload: <LoggerPayload>{
              usageDate: DateTime.now(),
              method: 'WebhookServices@handlePaymentSuccess',
              customer: {
                email: customerEmail,
              },
              subcontext: CONTEXT_WEBHOOK_METRICS,
              stack: error?.stack,
              error: error?.message,
              message: 'Something went wrong during payment success webhook',
            },
          },
          error?.stack,
          CONTEXT_ERROR,
        );
      }
    }
  }

  async formatUserProperties(
    contactData: ClickFunnelsContactInfo,
  ): Promise<Record<string, any>[]> {
    const properties: Record<string, any>[] = [];
    const randomString: string = Math.random().toString(36).slice(-8);
    const encryptedPassword: string = await bcrypt.hash(randomString, 10);
    if (!isUndefined(contactData.password)) {
      properties.push(
        {
          property: 'afy_password',
          value: randomString,
        },
        {
          property: 'afy_password_encrypted',
          value: encryptedPassword,
        },
      );
    }

    if (!isUndefined(contactData.text_message_opt_in)) {
      properties.push({
        property: 'text_message_opt_in',
        value: get(contactData, ['text_message_opt_in']),
      });
    }

    if (!isUndefined(contactData.email)) {
      properties.push({
        property: 'email',
        value: get(contactData, ['email']),
      });
    }

    if (!isUndefined(contactData.firstname)) {
      properties.push({
        property: 'firstname',
        value: get(contactData, ['firstname']),
      });
    }

    if (!isUndefined(contactData.lastname)) {
      properties.push({
        property: 'lastname',
        value: get(contactData, ['lastname']),
      });
    }
    if (!isUndefined(contactData.afy_package)) {
      properties.push({
        property: 'afy_package',
        value: get(contactData, ['afy_package']),
      });
    }
    return properties;
  }

  async clickfunnel(body: ClickFunnelsPayload): Promise<void> {
    this.logger.error({ body }, '', CONTEXT_CLICKFUNNEL_LOG);

    const contactData: ClickFunnelsContact = body.purchase.contact;

    const {
      text_message_opt_in: text_message_opt_in,
      text: password,
      email,
      first_name: firstname,
      last_name: lastname,
      book_packages: afy_package,
      book_credits: bookCredits,
    } = contactData;
    this.logger.error({ contactData }, '', CONTEXT_CLICKFUNNEL_LOG);

    const contactProperties: ClickFunnelsContactInfo = {
      email,
      firstname,
      lastname,
      text_message_opt_in,
      password,
      afy_package,
    };

    await this.formatUserProperties(contactProperties);

    await this.hubspotService.createOrUpdateContact(contactProperties);

    const user = await this.hubspotService.getContactDetailsByEmail(email);
    const userId = user.vid.toString();

    const bookCreditPackage = {
      id: userId,
      credits: bookCredits,
      packages: afy_package,
    };
    this.logger.error({ bookCreditPackage }, '', CONTEXT_CLICKFUNNEL_LOG);
    await this.hubspotService.updateCreditsAndPackages(bookCreditPackage);
  }

  async stripeSubscriptionSuccess(body: Stripe.Event): Promise<void> {
    const info: Stripe.Event.Data.Object = get(body, 'data.object');
    const customerEmail = <string>get(info, 'customer_email');
    const stripeSubscriptionId = <string>get(info, 'subscription');

    this.logger.log(
      {
        payload: <LoggerPayload>{
          email: customerEmail,
          method: 'stripeSubscriptionSuccess',
          usageDate: DateTime.now(),
          stripeSubscriptionId,
        },
      },
      CONTEXT_WEBHOOK_METRICS,
    );

    const customerName = get(info, 'customer_name');

    const [firstName = '', lastName = ''] = (
      customerName || get(info, 'customer_shipping.name', '')
    )?.split(' ');

    const lineItems = <Stripe.InvoiceLineItem[]>get(info, 'lines.data', []);

    const subscriptionInfo = lineItems.find(
      (lineItems) => lineItems.type == 'subscription',
    );
    const plan = get(subscriptionInfo, 'plan');

    if (!plan) {
      const stripePlanMessage = 'Stripe Plan not found';
      /* LOG */
      const planNotFoundPayload = {
        event: body.id,
        email: customerEmail,
        data: { stripeSubscriptionId },
        message: stripePlanMessage,
        usageDate: DateTime.now(),
      };
      this.logger.log(
        {
          payload: <LoggerPayload>{
            email: customerEmail,
            method: 'stripeSubscriptionSuccess',
            usageDate: DateTime.now(),
            planNotFoundPayload,
          },
        },
        CONTEXT_WEBHOOK_METRICS,
      );

      // status 200 to avoid stripe to retry the webhook
      throw new HttpException({ message: stripePlanMessage }, 200);
    }

    const customerAddressInfo = get(
      info,
      'customer_address',
      {},
    ) as Partial<Stripe.Event.Data.Object>;

    const {
      line1: address1,
      line2: address2,
      postal_code: zip,
      country,
      state,
      city,
    }: { [key: string]: string } = customerAddressInfo || {};

    const customerAddress = {
      city,
      country,
      state,
      address1,
      address2,
      address: `${address1} ${address2}`,
      zip,
    };

    const contactInfo = {
      email: customerEmail,
      phone: <string>get(info, 'number'),
    };

    this.logger.log(
      {
        payload: <LoggerPayload>{
          email: customerEmail,
          method: 'fetching Product info',
          usageDate: DateTime.now(),
          stripeId: plan.id,
          plan,
        },
      },
      CONTEXT_WEBHOOK_METRICS,
    );

    const productInfo = await this.productsService.getProductByStripeId(
      plan.id,
    );

    const productHandle = get(productInfo, 'chargifyProductHandle');
    const componentId = parseInt(get(productInfo, 'chargifyComponentId'));
    const productPriceHandle = get(productInfo, 'chargifyProductPriceHandle');

    this.logger.log(
      {
        payload: <LoggerPayload>{
          email: customerEmail,
          method: 'fetching Product info',
          usageDate: DateTime.now(),
          productHandle,
          componentId,
          productInfo,
          productPriceHandle,
        },
      },
      CONTEXT_WEBHOOK_METRICS,
    );

    if (!productHandle || !componentId) {
      const exceptionMessage = 'productHandle or componentId not found';
      /* LOG */
      const exceptionPayload = {
        eventId: body.id,
        email: customerEmail,
        productHandle,
        componentId,
        productInfo,
        productPriceHandle,
        message: exceptionMessage,
        usageDate: DateTime.now(),
      };
      this.logger.log(
        {
          payload: <LoggerPayload>{
            email: customerEmail,
            method: 'stripeSubscriptionSuccess',
            usageDate: DateTime.now(),
            exceptionPayload,
          },
        },
        CONTEXT_WEBHOOK_METRICS,
      );

      // status 200 to avoid stripe to retry the webhook
      throw new HttpException({ message: exceptionMessage }, 200);
    }

    const { ...rest } = customerAddress;

    const customer = get(info, 'customer');
    const nextBillingAt = get(info, 'due_date') || 0;

    const chargifySubscriptionPayload = {
      subscription: {
        product_handle: productHandle,
        next_billing_at: nextBillingAt && epochToHSDate(nextBillingAt),
        components: [
          {
            component_id: componentId,
            allocated_quantity: 1,
          },
        ],
        customer_attributes: {
          first_name: firstName,
          last_name: lastName,
          ...contactInfo,
          ...rest,
        },
        credit_card_attributes: {
          first_name: firstName,
          last_name: lastName,
          vault_token: customer,
          current_vault: 'stripe_connect',
          gateway_handle: 'stripe-handle',
        },
      },
    };
    this.logger.log(
      {
        payload: <LoggerPayload>{
          email: customerEmail,
          method: 'stripeSubscriptionSuccess',
          usageDate: DateTime.now(),
          chargifySubscriptionPayload,
        },
      },
      CONTEXT_WEBHOOK_METRICS,
    );

    const subscription = await this.paymentChargify.createSubscription(
      chargifySubscriptionPayload,
    );
    this.logger.log(
      {
        payload: <LoggerPayload>{
          email: customerEmail,
          method: 'stripeSubscriptionSuccess',
          message: 'chargify subscription',
          usageDate: DateTime.now(),
          subscription,
        },
      },
      CONTEXT_WEBHOOK_METRICS,
    );
    this.logger.log(
      {
        payload: <LoggerPayload>{
          email: customerEmail,
          method: 'stripeSubscriptionSuccess',
          message: 'Canceling stripe subscription',
          usageDate: DateTime.now(),
          stripeSubscriptionId,
        },
      },
      CONTEXT_WEBHOOK_METRICS,
    );
    await this.stripeService.cancelSubscription(stripeSubscriptionId);
  }

  async chargifyWebhookActivity(
    customerEmail: string,
    dto: CreateCustomerEventDto,
    body: { [key: string]: any },
  ): Promise<void> {
    const { event } = dto;
    const customer = await this.customersService.findByEmail(customerEmail);
    if (customer) {
      const data = {
        customer: customer,
        event: event,
        metadata: { body },
      };
      await this.customerEventsService.createEvent(customer, data);
    }
  }

  async handleBillingDateChange(req: WebhookPayload<SubscriptionPayload>) {
    const { payload } = req;
    const { subscription } = payload;

    const subscriptionId = subscription?.id;

    if (!subscriptionId) {
      throw new HttpException(
        {
          message: 'There is no subscriptionId found. No changes made',
        },
        HttpStatus.NOT_MODIFIED,
      );
    }

    const subObjects = await this.paymentChargify.getSubscriptionBySubId(
      subscriptionId.toString(),
    );

    const customerEmail = get(subObjects, [
      'subscription',
      'customer',
      'email',
    ]);

    const deal = await this.hubspotService.getDealBySubscriptionId(
      subscriptionId,
    );
    this.logger.log(
      {
        payload: <LoggerPayload>{
          customerEmail,
          method: 'handleBillingDateChange',
          usageDate: DateTime.now(),
          subscriptionId,
          deal,
        },
      },
      CONTEXT_WEBHOOK_METRICS,
    );

    if (!deal) {
      throw new HttpException(
        {
          message:
            'There is no Deal for this customer on Hubspot. No changes made',
        },
        HttpStatus.NOT_MODIFIED,
      );
    }
    const dealId = get(deal, ['id']);
    this.logger.log(
      {
        payload: <LoggerPayload>{
          customerEmail,
          method: 'handleBillingDateChange',
          usageDate: DateTime.now(),
          dealId,
        },
      },
      CONTEXT_WEBHOOK_METRICS,
    );

    const { current_period_ends_at } = subObjects.subscription;

    const next_recurring_date = convertToHSDate(current_period_ends_at);

    const body = {
      properties: {
        next_recurring_date,
      },
    };
    const subscriptionUpdated = { body, dealId };
    this.logger.log(
      {
        payload: <LoggerPayload>{
          customerEmail,
          method: 'handleBillingDateChange',
          usageDate: DateTime.now(),
          dealId,
          body,
        },
      },
      CONTEXT_WEBHOOK_METRICS,
    );
    await this.chargifyWebhookActivity(
      customerEmail,
      { event: Events.DEAL_UPDATE },
      subscriptionUpdated,
    );
    await this.hubspotService.updateDeal(dealId, body);
    this.logger.log(
      {
        payload: <LoggerPayload>{
          customerEmail,
          method: 'handleBillingDateChange',
          usageDate: DateTime.now(),
          message: 'deal updated with new billing date',
        },
      },
      CONTEXT_WEBHOOK_METRICS,
    );
  }

  /*
   * CRON JOB TRIGGERED BY LAMBDA FUNCTION
   */
  async handleMissingAssociation() {
    const failedAssociationsList = await this.customerPropertiesService.findAll(
      {
        filter: {
          module: { $eq: 'onboard' },
          value: { $eq: 'association' },
          deletedAt: { $eq: null },
        },
      },
    );

    if (!failedAssociationsList.length) return;

    for (const propertiesInfo of failedAssociationsList) {
      try {
        const customer = propertiesInfo.customer as CustomerDocument;
        const email = customer?.email || propertiesInfo?.customerEmail;

        const hubspotContactId = await this.hubspotService.getContactId(email);

        const metadata = propertiesInfo.metadata as { [key: string]: string };
        const { dealId } = metadata;

        if (hubspotContactId) {
          this.logger.log(
            {
              payload: <LoggerPayload>{
                email,
                method: 'handleMissingAssociation cronjob',
                usageDate: DateTime.now(),
                hubspotContactId,
                message: 'contact id found. Creating deal association',
              },
            },
            CONTEXT_CRONJOB_HANDLE_FAILED_EVENTS,
          );
          const association = await this.hubspotService.associateDealToContact(
            hubspotContactId,
            dealId,
          );

          if (association.id) {
            await this.customerPropertiesService.softDelete(propertiesInfo._id);
          }
        }
        metadata.reason = 'hubspotContact id not found';

        await sleep(250);
      } catch (err) {
        if (err instanceof Error) {
          this.logger.error(
            {
              payload: <LoggerPayload>{
                method: 'WebhookScheduler@handleMissingAssociation',
                usageDate: DateTime.now(),
                message: 'error while handling missing association',
              },
            },
            err?.stack,
            CONTEXT_CRONJOB_HANDLE_FAILED_EVENTS,
          );
        }
      }
    }

    this.logger.log(
      {
        payload: <LoggerPayload>{
          method: 'handleMissingAssociation cronjob',
          usageDate: DateTime.now(),
          message: 'Cronjob result',
        },
      },
      CONTEXT_CRONJOB_HANDLE_FAILED_EVENTS,
    );
  }
}

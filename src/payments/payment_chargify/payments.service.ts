import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { first, get, isEmpty, pick } from 'lodash';
import { ChargifyService } from '@/payments/chargify/chargify.service';
import {
  ROUTE_COMPONENT_ALLOCATION,
  ROUTE_COMPONENT_MIGRATE_SUBSCRIPTION,
  ROUTE_COMPONENT_PRICE_BY_PRICE_POINT_ID,
  ROUTE_CUSTOMERS_LIST,
  ROUTE_CUSTOMERS_SUBSCRIPTIONS,
  ROUTE_GET_PRODUCT_BY_HANDLE,
  ROUTE_INVOICE,
  ROUTE_INVOICE_CREATE,
  ROUTE_INVOICE_LIST,
  ROUTE_INVOICE_REFUND,
  ROUTE_INVOICE_VOID,
  ROUTE_PAYMENT_CREATE,
  ROUTE_PAYMENT_PROFILE_CREATE,
  ROUTE_PAYMENT_PROFILE_UPDATE,
  ROUTE_PREVIEW_ALLOCATION,
  ROUTE_RESOURCE_METADATA,
  ROUTE_SEND_INVOICE,
  ROUTE_SUBSCRIPTION_ACTIVATE,
  ROUTE_SUBSCRIPTION_BY_ID,
  ROUTE_SUBSCRIPTION_COMPONENT,
  ROUTE_SUBSCRIPTION_COMPONENTS,
  ROUTE_SUBSCRIPTION_CREATE,
  ROUTE_SUBSCRIPTION_EVENTS,
  ROUTE_SUBSCRIPTION_PURGE,
  ROUTE_SUBSCRIPTION_UPDATE,
} from './routes';
import {
  paramsStringify,
  replaceAll,
  replaceRouteParameter,
} from '@/internal/utils/url';
import { AVAILABLE_PLANS_TYPES } from '@/legacy/dis/legacy/payments/payments.constants';
import { ProductDocument } from '@/onboard/products/schemas/product.schema';
import {
  subscriptionEventsFilters,
  subscriptionFilters,
} from './payments.constants';
import {
  ComponentDto,
  CreateSubscriptionErrorResponseObject,
  CreditCard,
  Customer,
  Invoice,
  InvoiceList,
  Metadata,
  MetadataPaginationSchema,
  PaymentProfile,
  PaymentProfiles,
  ProductResult,
  SendInvoiceEmails,
  State,
  Subscription,
  SubscriptionComponent,
  SubscriptionComponentResponseObject,
  SubscriptionInvoice,
  SubscriptionResponseObject,
} from '@/payments/chargify/domain/types';
import {
  ComponentPriceInfoDto,
  CreateSubscriptionDto,
  CurrentSubscriptionDto,
  Events,
  SubscriptionEvent,
  UpdateSubscriptionDto,
} from './dto/subscription.dto';
import {
  ActivateSubscription,
  AllocateComponentDto,
  Allocation,
  Allocations,
  AllocationsPreview,
  CreatePreviewAllocationDto,
} from './dto/components.dto';
import { createPaymentProfileDto } from './dto/paymentProfile.dto';
import { CreateInvoiceDto, VoidInvoiceDto } from './dto/invoice.dto';
import { createPaymentDto } from './dto/payment.dto';
import { ErrorInfo, PlanTypes } from './types';
import {
  CONTEXT_CHARGIFY,
  CONTEXT_ERROR,
  CONTEXT_PAYMENT_CHARGIFY_SERVICE,
} from '@/internal/common/contexts';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';
import { PaymentsWebsocketGateway } from '@/payments/payment_chargify/gateways/payments.gateway';
import { PaymentStatusDto } from '@/payments/payment_chargify/dto/payment-status.dto';
import { SchemaId } from '@/internal/types/helpers';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { FilterQuery } from 'mongoose';
import { ProductsService } from '@/onboard/products/products.service';
import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import { CmsService } from '@/cms/cms/cms.service';
import { InvoiceRefundDTO } from '@/payments/payment_chargify/dto/invoice-refund.dto';
import { isQAEmailAuthorify } from '@/payments/payment_chargify/helpers';
import { PaymentStatusRepository } from '@/payments/payment_chargify/repositories/payment-status.repository';
import { Transaction as ChargifyTransactionDTO } from '@/payments/payment_chargify/schemas/payment-status.schema';

@Injectable()
export class PaymentChargifyService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly chargifyService: ChargifyService,
    private readonly paymentSocketGateway: PaymentsWebsocketGateway,
    private readonly cmsService: CmsService,
    private readonly logger: Logger,
    private readonly paymentStatusRepository: PaymentStatusRepository,
  ) {}

  async findPaymentStatusBySubscriptionId(
    productId: string,
    subscriptionId: string,
  ) {
    const result =
      await this.paymentStatusRepository.findBySubscriptionIdAndProductId(
        productId,
        subscriptionId,
      );

    if (!result) {
      throw new Error('Payment status not found');
    }

    return result;
  }

  createPaymentStatus(paymentStatus: ChargifyTransactionDTO) {
    const status = paymentStatus?.success ? 'SUCCESS' : 'FAILED';
    return this.paymentStatusRepository.store({
      transaction: paymentStatus,
      status,
    });
  }

  find<T = any>(url: string, params?: Record<string, any>): Promise<T> {
    return this.chargifyService.passthru<T>(url, 'get', { params });
  }

  // subscriptions
  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<
    SubscriptionResponseObject & CreateSubscriptionErrorResponseObject
  > {
    try {
      const subscriptionCreated = await this.generalCreate<
        SubscriptionResponseObject & CreateSubscriptionErrorResponseObject
      >(ROUTE_SUBSCRIPTION_CREATE, createSubscriptionDto);
      return subscriptionCreated;
    } catch (error) {
      this.logger.error(
        {
          payload: <LoggerPayload>{
            usageDate: DateTime.now(),
            error,
            subcontext: CONTEXT_CHARGIFY,
          },
        },
        '',
        CONTEXT_ERROR,
      );
      if (error instanceof Error) {
        throw new HttpException(
          {
            message: 'unable to create chargify subscription',
            error: error?.message,
            stack: error?.stack,
            name: error?.name,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  updateSubscription(
    subscriptionId: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionResponseObject> {
    if (!subscriptionId) {
      throw new HttpException(
        { message: 'missing param subscription_id' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const url = replaceRouteParameter(
      ROUTE_SUBSCRIPTION_UPDATE,
      ':id',
      `${subscriptionId}`,
    );
    return this.generalUpdate(url, updateSubscriptionDto);
  }

  async findSubscriptionById(
    subscriptionId: string,
  ): Promise<SubscriptionResponseObject> {
    if (!subscriptionId) {
      throw new HttpException(
        { message: 'missing param subscription_id' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const url = replaceRouteParameter(
      ROUTE_SUBSCRIPTION_UPDATE,
      ':id',
      `${subscriptionId}`,
    );
    return await this.find(url);
  }

  purgeSubscription(
    subscriptionId: string,
    query: string,
  ): Promise<SubscriptionResponseObject> {
    const hasSubscriptionId = query.includes('subscription_id');

    if (!subscriptionId || !hasSubscriptionId) {
      throw new HttpException(
        { message: 'missing param subscription_id' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const url =
      replaceRouteParameter(ROUTE_SUBSCRIPTION_PURGE, ':id', subscriptionId) +
      `?${query}`;
    return this.generalDelete(url);
  }

  activateSubscription(
    subscriptionId: number,
    activateSubscription: ActivateSubscription,
  ): Promise<SubscriptionResponseObject> {
    if (!subscriptionId) {
      throw new HttpException(
        { message: 'Missing Subscription Id' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const url = replaceRouteParameter(
      ROUTE_SUBSCRIPTION_ACTIVATE,
      ':subscriptionId',
      `${subscriptionId}`,
    );

    return this.generalUpdate(url, activateSubscription);
  }

  // Invoices

  createInvoice(
    subscriptionId: string,
    createInvoiceDto: CreateInvoiceDto,
  ): Promise<SubscriptionInvoice> {
    if (!subscriptionId) {
      throw new HttpException(
        { message: 'missing param subscription_id' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const url = replaceRouteParameter(
      ROUTE_INVOICE_CREATE,
      ':id',
      `${subscriptionId}`,
    );
    return this.generalCreate(url, createInvoiceDto);
  }

  voidInvoice(
    invoiceId: string,
    updateInvoiceDto: VoidInvoiceDto,
  ): Promise<Invoice> {
    if (!invoiceId) {
      throw new HttpException(
        { message: 'missing param invoice id' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const url = replaceRouteParameter(ROUTE_INVOICE_VOID, ':id', invoiceId);
    return this.generalCreate(url, updateInvoiceDto);
  }

  // Payment

  createPayment(
    invoiceId: string,
    createPaymentDto: createPaymentDto,
  ): Promise<Invoice> {
    if (!invoiceId) {
      throw new HttpException(
        { message: 'missing param invoiceId' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const url = replaceRouteParameter(ROUTE_PAYMENT_CREATE, ':id', invoiceId);
    return this.generalCreate(url, createPaymentDto);
  }

  // Payment Profiles

  async createPaymentProfile(
    userEmail: string,
    createPaymentDto: createPaymentProfileDto,
  ): Promise<PaymentProfiles> {
    if (!userEmail) {
      throw new HttpException(
        { message: 'missing key customer_email or customer_id' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const payload = {
      payment_profile: {
        chargify_token: createPaymentDto.chargifyToken,
        customer_id: '',
      },
    };

    const customer = await this.getCustomerInfoFromEmail(userEmail);
    payload.payment_profile.customer_id = customer.id;

    return this.generalCreate(ROUTE_PAYMENT_PROFILE_CREATE, payload);
  }

  updatePaymentProfile(
    paymentProfileId: string,
    updatePaymentProfileDto: createPaymentProfileDto,
  ): Promise<PaymentProfiles> {
    if (!paymentProfileId) {
      throw new HttpException(
        { message: 'missing param paymentProfile_id' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const url = replaceRouteParameter(
      ROUTE_PAYMENT_PROFILE_UPDATE,
      ':id',
      `${paymentProfileId}`,
    );
    return this.generalUpdate(url, updatePaymentProfileDto);
  }

  getPaymentProfile(paymentProfileId: string): Promise<PaymentProfiles> {
    if (!paymentProfileId) {
      throw new HttpException(
        { message: 'missing param paymentProfile_id' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const url = replaceRouteParameter(
      ROUTE_PAYMENT_PROFILE_UPDATE,
      ':id',
      `${paymentProfileId}`,
    );
    return this.find(url);
  }

  getComponentDetails(handle: string): Promise<ComponentDto> {
    if (!handle) {
      throw new HttpException(
        { message: 'missing param component handle' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const url = `components/lookup.json?handle=${handle}`;
    return this.find(url);
  }

  getMetadataForResource(
    resourceType: string,
    resourceId: number,
  ): Promise<MetadataPaginationSchema> {
    const url: string = replaceAll(ROUTE_RESOURCE_METADATA, {
      _id: resourceId,
      _type: resourceType,
    });
    return this.chargifyService.passthru(url, 'get', {});
  }

  async setMetadataForResource(
    resourceType: 'subscriptions' | 'customers',
    resourceId: number,
    metadata: Array<Pick<Metadata, 'name' | 'value'>>,
  ) {
    const url: string = replaceAll(ROUTE_RESOURCE_METADATA, {
      _type: resourceType,
      _id: resourceId,
    });

    const payload: Array<Pick<Metadata, 'name' | 'value'>> = metadata.map(
      (meta) => {
        const { name, value } = meta;
        return { name, value };
      },
    );

    const metadataPayload = {
      metadata: payload,
    };

    return this.chargifyService.passthru(url, 'post', metadataPayload);
  }

  async getCustomerInfoFromEmail(customerEmail: string): Promise<Customer> {
    const url: string = replaceRouteParameter(
      ROUTE_CUSTOMERS_LIST,
      ':query',
      customerEmail,
    );
    const response: Customer[] = await this.find(url);
    const customer = <Customer>get(response, '[0].customer');

    return customer;
  }

  private generateKey(obj: PaymentProfile): string {
    const lastFourDigits = obj.masked_card_number.substr(-4);
    return (
      lastFourDigits +
      obj.card_type +
      obj.expiration_month.toString() +
      obj.expiration_year.toString() +
      obj.payment_type
    );
  }

  private removeDuplicatePaymentProfile(
    data: PaymentProfiles[],
  ): PaymentProfiles[] {
    const uniquePaymentsProfile: Map<string, PaymentProfiles> = new Map();
    data.forEach((v: PaymentProfiles) => {
      uniquePaymentsProfile.set(this.generateKey(v.payment_profile), v);
    });
    return Array.from(uniquePaymentsProfile.values());
  }

  async getPaymentProfilesFromEmail(email: string): Promise<PaymentProfiles[]> {
    const customer = await this.getCustomerInfoFromEmail(email);
    const finalPaymentProfiles = await this.getPaymentProfilesFromChargify(
      customer.id,
    );
    return this.removeDuplicatePaymentProfile(finalPaymentProfiles);
  }

  async getPaymentProfilesFromChargify(id: string): Promise<PaymentProfiles[]> {
    const url = ROUTE_PAYMENT_PROFILE_CREATE + `?customer_id=${id}`;
    return this.find<PaymentProfiles[]>(url);
  }

  async getPaymentProfilesListFromEmail(
    email: string,
  ): Promise<PaymentProfile[]> {
    const customer = await this.getCustomerInfoFromEmail(email);
    if (!customer) {
      return [];
    }

    const finalPaymentProfiles = await this.getPaymentProfilesFromChargify(
      customer.id,
    );

    const paymentProfiles =
      this.removeDuplicatePaymentProfile(finalPaymentProfiles);
    if (paymentProfiles.length) {
      return paymentProfiles.map((paymentProfile, idx) => {
        paymentProfile.payment_profile.expired = this.isExpired(
          paymentProfile.payment_profile,
        );
        paymentProfile.payment_profile.default = idx === 0;
        paymentProfile.payment_profile.email = email;
        return paymentProfile.payment_profile;
      });
    }
    return [];
  }

  async getShowCreditsButton(email: string): Promise<boolean> {
    const customerData = await this.getCustomerInfoFromEmail(email);

    if (!customerData?.id) {
      this.logger.log(
        {
          payload: {
            message: 'Chargify Customer does not exist',
            method: 'getShowCreditsButton',
            usageDate: DateTime.now(),
          },
        },
        CONTEXT_PAYMENT_CHARGIFY_SERVICE,
      );
      return false;
    }

    const url = replaceRouteParameter(
      ROUTE_CUSTOMERS_SUBSCRIPTIONS,
      ':id',
      customerData.id,
    );
    const allSubscriptions: SubscriptionResponseObject[] = await this.find(url);
    const subscriptions: Subscription[] = allSubscriptions.map(
      (sub) => sub.subscription,
    );

    if (isEmpty(subscriptions)) {
      return false;
    }

    const filteredAuthorifySubscriptions: Array<Subscription> =
      subscriptions?.filter(({ product }) => {
        let required = false;
        const { name } = product;
        const isAuthorifyMembership =
          name &&
          name.includes('Authorify') &&
          AVAILABLE_PLANS_TYPES.some((v) => name.includes(v));
        if (isAuthorifyMembership || !name) {
          required = true;
        }
        return required;
      });

    const firstSubscription = first(filteredAuthorifySubscriptions);

    if (!firstSubscription || firstSubscription.state === State.TRIALING) {
      return false;
    }
    const componentsLists = await this.getComponentsBySubscriptionId(
      firstSubscription.id,
    );

    if (isEmpty(componentsLists)) {
      return false;
    }

    const { component_id } = componentsLists[0];
    const query: FilterQuery<ProductDocument> = {
      chargifyComponentId: component_id.toString(),
    };
    const productObj: ProductDocument = await this.productsService.find(query);
    return !!productObj?.toShowBuyCredits;
  }

  async getBillingHistory(
    customer: CustomerDocument,
    startDate: string,
    endDate: string,
    page = 0,
    perPage = 15,
  ): Promise<PaginatorSchematicsInterface<Invoice> | []> {
    const subscriptionDetails =
      await this.getAllActiveSubscriptionsFromCustomerEmail(customer.email);

    if (isEmpty(subscriptionDetails)) {
      return [];
    }

    const { id: subscriptionId } = subscriptionDetails[0];
    const [subscriptionComponent] =
      await this.getAllAllocatedComponentsFromSubscription(
        subscriptionDetails[0],
      );

    const paramsData = paramsStringify({
      subscription_id: subscriptionId,
      date_field: 'paid_date',
      payments: true,
      start_date: startDate,
      end_date: endDate,
      page,
      per_page: perPage,
    });

    const url = `${ROUTE_INVOICE_LIST}?${paramsData}`;
    const invoiceList: InvoiceList = await this.find(url);
    const result = invoiceList.invoices;

    if (isEmpty(result)) {
      return [];
    }

    const response = result.map((info) => {
      info.invoice_download = info.public_url.replace('?', '.pdf?');
      info.subscriptionComponent = subscriptionComponent;
      return info;
    });

    const invoiceListPaginated = PaginatorSchema.build<Invoice>(
      invoiceList.meta.total_invoice_count,
      response,
      --page,
      perPage,
    );

    return invoiceListPaginated;
  }

  async getComponentsBySubscriptionId(
    subscriptionId: string | number,
  ): Promise<SubscriptionComponent[]> {
    const url = replaceRouteParameter(
      ROUTE_SUBSCRIPTION_COMPONENTS,
      ':id',
      `${subscriptionId}`,
    );
    const response: SubscriptionComponent[] = (await this.find(url)) || [];

    const componentsList =
      response
        .filter((info) => get(info, 'component.allocated_quantity'))
        .map((info) => info.component as SubscriptionComponent) || [];
    return componentsList;
  }

  isExpired(paymentProfile: PaymentProfile): boolean {
    const { expiration_month, expiration_year } = paymentProfile;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    return (
      expiration_year < currentYear ||
      (expiration_year === currentYear && expiration_month < currentMonth)
    );
  }

  async getSubscriptionEvents(subscriptionId: number): Promise<Events[]> {
    const url = replaceRouteParameter(
      ROUTE_SUBSCRIPTION_EVENTS,
      ':id',
      `${subscriptionId}`,
    );
    return this.find(url);
  }

  async getSubscriptionBySubId(
    subscriptionId: string,
  ): Promise<{ subscription: Subscription } | null> {
    const url: string = replaceRouteParameter(
      ROUTE_SUBSCRIPTION_BY_ID,
      ':id',
      subscriptionId,
    );
    return this.find(url);
  }

  async getInvoiceByInvoiceId(invoiceId: string): Promise<Invoice | null> {
    const url: string = replaceRouteParameter(ROUTE_INVOICE, ':id', invoiceId);
    return this.find(url);
  }

  async sendInvoice(invoiceId: string, reqObject: SendInvoiceEmails) {
    const url: string = replaceRouteParameter(
      ROUTE_SEND_INVOICE,
      ':id',
      invoiceId,
    );
    return this.generalCreate(url, reqObject);
  }

  async addEventNameInSubscription(subscriptions: Array<Subscription>) {
    const updatedSubscriptionList = subscriptions.map(
      async (subscription: Partial<Subscription>) => {
        const events = await this.getSubscriptionEvents(subscription?.id);
        const component = await this.addComponentUnitPriceInComponent(
          subscription.id,
        );
        const filteredEvents = events.filter(({ event }) =>
          subscriptionEventsFilters.includes(event.key),
        );
        const { key: billingReason, message } = get(
          filteredEvents,
          '[0].event',
          {},
        ) as SubscriptionEvent;
        return { ...subscription, billingReason, message, component };
      },
    );
    return Promise.all(updatedSubscriptionList);
  }

  async getOnlySubscriptionsFromCustomerEmail(
    email: string,
  ): Promise<Array<Subscription> | null> {
    const customer = await this.getCustomerInfoFromEmail(email);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const url = replaceRouteParameter(
      ROUTE_CUSTOMERS_SUBSCRIPTIONS,
      ':id',
      customer.id,
    );
    const response: SubscriptionResponseObject[] = await this.find(url);
    return response.map((sub) => sub.subscription);
  }

  async getSubscriptionFromEmailRaw(email: string) {
    const customer = await this.getCustomerInfoFromEmail(email);
    if (isEmpty(customer)) {
      throw new HttpException(
        {
          message: 'Customer not found in Chargify with email address',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const url = replaceRouteParameter(
      ROUTE_CUSTOMERS_SUBSCRIPTIONS,
      ':id',
      customer.id,
    );
    return await this.find<SubscriptionResponseObject[]>(url);
  }

  async getSubscriptionsFromEmail(
    email: string,
    isAllActiveRequired: keyof typeof subscriptionFilters = 'false',
  ): Promise<Partial<Subscription> | Partial<CurrentSubscriptionDto>> {
    const customer = await this.getCustomerInfoFromEmail(email);
    if (isEmpty(customer)) {
      throw new HttpException(
        {
          message: 'Customer not found in Chargify with email address',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const url = replaceRouteParameter(
      ROUTE_CUSTOMERS_SUBSCRIPTIONS,
      ':id',
      customer.id,
    );
    const allSubscriptions: SubscriptionResponseObject[] = await this.find(url);
    if (isEmpty(allSubscriptions)) {
      throw new HttpException(
        {
          message: 'There is no subscriptions found with email address',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const subscriptions: Subscription[] = allSubscriptions.map(
      (sub) => sub.subscription,
    );
    if (isAllActiveRequired === 'ALL') {
      return this.addEventNameInSubscription(subscriptions);
    }

    if (isAllActiveRequired === 'true') {
      return this.buildSubscriptionObject(subscriptions);
    }

    const filteredAuthorifySubscriptions: Array<Subscription> =
      subscriptions?.filter(({ product }) => {
        let required = false;
        if (isAllActiveRequired === 'false') {
          const { name } = product;
          const isAuthorifyMembership =
            name &&
            name.includes('Authorify') &&
            AVAILABLE_PLANS_TYPES.some((v) => name.includes(v));
          if (isAuthorifyMembership || !name) {
            required = true;
          }
        }
        return required;
      });
    return this.buildSubscriptionObject(filteredAuthorifySubscriptions);
  }

  async getDefaultPaymentProfile(email: string): Promise<CreditCard> {
    try {
      const subscriptions =
        await this.getAllActiveSubscriptionsFromCustomerEmail(email);
      return <CreditCard>get(subscriptions, ['0', 'credit_card']);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          {
            message: 'unable to get default payment profile',
            error: error?.message,
            stack: error?.stack,
            name: error?.name,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async changeDefaultPaymentProfile(
    email: string,
    paymentProfileId: string,
  ): Promise<Array<PaymentProfiles>> {
    try {
      const paymentProfiles: PaymentProfiles[] = [];
      const subscription =
        await this.getAllActiveSubscriptionsFromCustomerEmail(email);
      for (const subscriptions of subscription) {
        const url = `/subscriptions/${subscriptions.id}/payment_profiles/${paymentProfileId}/change_payment_profile.json`;
        const response: PaymentProfiles = await this.generalCreate(url, {});
        paymentProfiles.push(response);
      }
      return paymentProfiles;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          {
            message: 'unable to create change payment profile',
            error: error?.message,
            stack: error?.stack,
            name: error?.name,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async deletePaymentProfile(
    profileId: string,
    email: string,
  ): Promise<{ message: string }> {
    if (!profileId) {
      throw new HttpException(
        {
          message: 'profileId is required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!email) {
      throw new HttpException(
        {
          message: 'email is required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const url = `/payment_profiles/${profileId}.json`;
      const defaultPayment = await this.getDefaultPaymentProfile(email);
      const defaultPaymentId = get(defaultPayment, 'id');
      if (defaultPaymentId.toString() === profileId.toString()) {
        throw new HttpException(
          {
            message: 'unable to delete default payment profile',
          },
          HttpStatus.OK,
        );
      }
      await this.generalDelete(url);
      return { message: 'Payment profile deleted successfully' };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          {
            message: 'unable to delete default payment profile',
            error: error?.message,
            stack: error?.stack,
            name: error?.name,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async changePaymentProfileForSubscription(
    subscription_id: string,
    paymentProfileId: string,
  ): Promise<PaymentProfiles> {
    if (!subscription_id || !paymentProfileId) {
      throw new HttpException(
        { message: 'subscription Id Or Payment Profile Id Not found' },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const url = `/subscriptions/${subscription_id}/payment_profiles/${paymentProfileId}/change_payment_profile.json`;
      const response: PaymentProfiles = await this.generalCreate(url, {});
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          {
            message: 'unable to create change payment profile',
            error: error?.message,
            stack: error?.stack,
            name: error?.name,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getSubscriptionComponents(
    subscriptionId: string | number,
    isAllListRequired = false,
  ): Promise<SubscriptionComponent | SubscriptionComponent[]> {
    const url = replaceRouteParameter(
      ROUTE_SUBSCRIPTION_COMPONENTS,
      ':id',
      `${subscriptionId}`,
    );
    const response: SubscriptionComponent[] = (await this.find(url)) || [];

    if (isAllListRequired) {
      return (
        response.map((info) => info.component as SubscriptionComponent) || []
      );
    }

    const componentsList =
      response
        .filter((info) => get(info, 'component.allocated_quantity'))
        .map((info) => info.component as SubscriptionComponent) || [];
    return first(componentsList);
  }

  // preview-allocation

  async createPreviewAllocation(
    subscriptionId: string,
    createPreviewDto: CreatePreviewAllocationDto,
  ) {
    if (!subscriptionId) {
      throw new HttpException(
        { message: 'Bad request' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const url = replaceRouteParameter(
      ROUTE_PREVIEW_ALLOCATION,
      ':id',
      subscriptionId,
    );
    const response = await this.generalCreate<AllocationsPreview>(
      url,
      createPreviewDto,
    );
    try {
      return get(response, 'allocation_preview');
    } catch (e) {
      this.logger.log(
        {
          payload: <LoggerPayload>{
            usageDate: DateTime.now(),
            message: `${JSON.stringify(e)}`,
          },
        },
        CONTEXT_PAYMENT_CHARGIFY_SERVICE,
      );
      return Promise.reject(e);
    }
  }

  async getAllocation(result: Allocations[]): Promise<Allocation> {
    const allocatedComponents = result
      ?.filter((comp) => comp.allocation.quantity)
      .map((info: { allocation: Allocation }) => info.allocation);
    const allocatedComponent = first(allocatedComponents);
    const subId = get(allocatedComponent, 'subscription_id')?.toString();
    const readSubscriptionUrl = replaceRouteParameter(
      ROUTE_SUBSCRIPTION_UPDATE,
      ':id',
      subId,
    );
    const { subscription }: SubscriptionResponseObject = await this.find(
      readSubscriptionUrl,
    );
    return {
      ...allocatedComponent,
      renewalDate: subscription.current_period_ends_at,
    };
  }

  async allocateOnce(
    allocationDto: AllocateComponentDto,
    state: State,
  ): Promise<Allocation> {
    const { subscriptionId, newComponentId } = allocationDto;
    if (!subscriptionId || !newComponentId) {
      throw new HttpException(
        {
          message:
            'Bad request, Missing property subscriptionId, newComponentId',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const url = replaceRouteParameter(
      ROUTE_COMPONENT_ALLOCATION,
      ':id',
      `${subscriptionId}`,
    );

    const component = (await this.getSubscriptionComponents(
      subscriptionId,
    )) as SubscriptionComponent;

    let responseDegraded: Allocations[] = [];

    const isTrialing = state === State.TRIALING;

    if (!isEmpty(component)) {
      const currentComponentId = component.component_id;

      const downPayload = {
        accrue_charge: false,
        upgrade_charge: 'prorated',
        downgrade_credit: 'prorated',
        allocations: [
          {
            component_id: currentComponentId,
            quantity: 0,
            accrue_charge: false,
            upgrade_charge: 'prorated',
            downgrade_credit: 'prorated',
          },
        ],
      };

      responseDegraded = await this.generalCreate(url, downPayload);
    }

    const upPayload = {
      accrue_charge: false,
      upgrade_charge: isTrialing ? 'none' : 'prorated',
      downgrade_credit: isTrialing ? 'none' : 'prorated',
      allocations: [
        {
          component_id: newComponentId,
          quantity: 1,
          accrue_charge: false,
          upgrade_charge: isTrialing ? 'none' : 'prorated',
          downgrade_credit: isTrialing ? 'none' : 'prorated',
        },
      ],
    };
    const responseUpgraded: Allocations[] = await this.generalCreate(
      url,
      upPayload,
    );

    const result = [...responseUpgraded, ...responseDegraded];

    return await this.getAllocation(result);
  }

  // allocate component
  async allocateComponent(
    allocationDto: AllocateComponentDto,
  ): Promise<Allocation> {
    const { subscriptionId, newComponentId } = allocationDto;

    if (!subscriptionId || !newComponentId) {
      throw new HttpException(
        {
          message:
            'Bad request, Missing property subscriptionId, newComponentId',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const component = (await this.getSubscriptionComponents(
      subscriptionId,
    )) as SubscriptionComponent;

    if (isEmpty(component)) {
      throw new HttpException(
        {
          message: 'Component not found in this subscription',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentComponentId = component.component_id;

    // To update product as well
    await this.migrateSubscription(subscriptionId, newComponentId);

    const url = replaceRouteParameter(
      ROUTE_COMPONENT_ALLOCATION,
      ':id',
      `${subscriptionId}`,
    );
    const downPayload = {
      accrue_charge: false,
      upgrade_charge: 'prorated',
      downgrade_credit: 'prorated',
      allocations: [
        {
          component_id: currentComponentId,
          quantity: 0,
          accrue_charge: false,
          upgrade_charge: 'prorated',
          downgrade_credit: 'prorated',
        },
      ],
    };

    const responseDegraded: Allocations[] = await this.generalCreate(
      url,
      downPayload,
    );

    const upPayload = {
      accrue_charge: false,
      upgrade_charge: 'prorated',
      downgrade_credit: 'prorated',
      allocations: [
        {
          component_id: newComponentId,
          quantity: 1,
          accrue_charge: false,
          upgrade_charge: 'prorated',
          downgrade_credit: 'prorated',
        },
      ],
    };
    const responseUpgraded: Allocations[] = await this.generalCreate(
      url,
      upPayload,
    );
    const result = [...responseDegraded, ...responseUpgraded];

    return await this.getAllocation(result);
  }

  async getComponentPriceByPricePointId(
    componentId: number,
  ): Promise<ComponentPriceInfoDto> {
    if (!componentId) {
      throw new HttpException(
        { message: 'Bad request' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const url = replaceRouteParameter(
      ROUTE_COMPONENT_PRICE_BY_PRICE_POINT_ID,
      ':id',
      `${componentId}`,
    );
    const response: { price_points: ComponentPriceInfoDto[] } = await this.find(
      url,
    );
    return first(response.price_points);
  }

  async getProductByHandle(handle: string): Promise<ProductResult> {
    if (!handle) {
      throw new HttpException(
        { message: 'Bad request' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const url = replaceRouteParameter(
      ROUTE_GET_PRODUCT_BY_HANDLE,
      ':id',
      `${handle}`,
    );
    const response: ProductResult = await this.find(url);
    return response;
  }

  async getAllSubscriptionsFromCustomerEmail(
    email: string,
  ): Promise<Array<Subscription>> {
    const customer = await this.getCustomerInfoFromEmail(email);
    if (!customer) {
      return null;
    }
    const url = replaceRouteParameter(
      ROUTE_CUSTOMERS_SUBSCRIPTIONS,
      ':id',
      customer.id,
    );
    const subscriptionsResponse = await this.find<
      Array<SubscriptionResponseObject>
    >(url);

    return subscriptionsResponse.map(({ subscription }) => subscription);
  }

  async getAllActiveSubscriptionsFromCustomerEmail(
    email: string,
  ): Promise<Array<Subscription> | null> {
    const subscriptions = await this.getAllSubscriptionsFromCustomerEmail(
      email,
    );
    const activeStates = [State.ACTIVE, State.TRIALING];
    if (!get(subscriptions, 'length')) {
      return null;
    }

    return subscriptions.filter((subscription) => {
      return activeStates.includes(subscription.state);
    });
  }

  async getComponentsFromSubscription(
    subscription: Subscription,
  ): Promise<Array<SubscriptionComponent>> {
    const url = replaceRouteParameter(
      ROUTE_SUBSCRIPTION_COMPONENT,
      ':id',
      `${subscription.id}`,
    );

    const subscriptionComponentResponse: SubscriptionComponentResponseObject[] =
      await this.find(url);

    return subscriptionComponentResponse.map(({ component }) => component);
  }

  async getAllAllocatedComponentsFromSubscription(
    subscription: Subscription,
  ): Promise<Array<SubscriptionComponent>> {
    const components = await this.getComponentsFromSubscription(subscription);

    return components.filter(
      ({ allocated_quantity }) => allocated_quantity > 0,
    );
  }

  async migrateSubscription(
    subscriptionId: number,
    newComponentId: number,
  ): Promise<SubscriptionResponseObject> {
    const componentsList = (await this.getSubscriptionComponents(
      subscriptionId,
      true,
    )) as SubscriptionComponent[];

    const currentComponent: SubscriptionComponent = componentsList.find(
      (comp) => comp.allocated_quantity,
    );

    const newComponent: SubscriptionComponent = componentsList.find(
      (comp) => comp.component_id === newComponentId,
    );

    const readSubscriptionUrl: string = replaceRouteParameter(
      ROUTE_SUBSCRIPTION_UPDATE,
      ':id',
      `${subscriptionId}`,
    );
    const { subscription }: SubscriptionResponseObject = await this.find(
      readSubscriptionUrl,
    );
    const productHandle = get(subscription, 'product.handle') as string;
    const replacer: string = currentComponent.component_handle.split('_')[1];
    const newValue: string = newComponent.component_handle.split('_')[1];
    const newProductHandle: string = productHandle.replace(replacer, newValue);

    if (productHandle === newProductHandle) {
      return { subscription };
    }

    const payload = {
      migration: {
        product_handle: newProductHandle,
      },
    };
    const url = replaceRouteParameter(
      ROUTE_COMPONENT_MIGRATE_SUBSCRIPTION,
      ':id',
      `${subscriptionId}`,
    );
    return this.generalCreate(url, payload);
  }

  public sendSuccessPaymentEventToSocket(
    dto: Pick<PaymentStatusDto, 'id' | 'email'>,
  ): boolean {
    const data: PaymentStatusDto = {
      ...dto,
      isApproved: true,
    };
    return this.paymentSocketGateway.sendPaymentStatus(data);
  }

  public sendSuccessUpsellPaymentEventToSocket(
    dto: Pick<PaymentStatusDto, 'id' | 'email'> & {
      sessionId: SchemaId;
      offerCode: string;
    },
  ): boolean {
    return this.paymentSocketGateway.sendUpsellStatus({
      ...dto,
      isApproved: true,
    });
  }

  public sendRmSuccessEventToSocket(
    dto: Pick<PaymentStatusDto, 'id' | 'email'>,
  ): boolean {
    return this.paymentSocketGateway.sendRMStatus({
      ...dto,
      isApproved: true,
    });
  }

  private async addComponentUnitPriceInComponent(
    subscriptionId: number,
  ): Promise<SubscriptionComponent> {
    const component = (await this.getSubscriptionComponents(
      subscriptionId,
    )) as SubscriptionComponent;
    const componentPriceInfo: ComponentPriceInfoDto =
      await this.getComponentPriceByPricePointId(component?.component_id);
    const unitPrice = get(componentPriceInfo, 'prices[0].unit_price');
    return { ...component, unitPrice };
  }

  private async buildSubscriptionObject(subscriptions: Subscription[]) {
    const firstSubscription = first(subscriptions);
    const component = await this.addComponentUnitPriceInComponent(
      firstSubscription.id,
    );
    const subscriptionObj: Partial<Subscription> = pick(firstSubscription, [
      'current_period_ends_at',
      'product.name',
      'currency',
      'signup_revenue',
      'product.interval',
      'product.interval_unit',
      'product.handle',
      'product.id',
      'product.product_family',
      'customer',
      'state',
      'id',
    ]);
    subscriptionObj.component = component;
    return subscriptionObj;
  }

  // general methods
  private async generalCreate<T = any>(
    route: string,
    data: object,
  ): Promise<T> {
    try {
      return await this.chargifyService.passthru<T>(route, 'post', data);
    } catch (error) {
      if (error instanceof ErrorInfo) {
        const { status } = error.response;
        throw new HttpException(error?.message, status);
      }
    }
  }

  private async generalUpdate<T = any>(
    route: string,
    data: object,
  ): Promise<T> {
    try {
      return await this.chargifyService.passthru<T>(route, 'put', data);
    } catch (error) {
      if (error instanceof ErrorInfo) {
        const { status } = error.response;
        throw new HttpException(error?.message, status);
      }
    }
  }

  private async generalDelete<T = any>(
    route: string,
    data: object = {},
  ): Promise<T> {
    try {
      return await this.chargifyService.passthru<T>(route, 'delete', data);
    } catch (error) {
      if (error instanceof ErrorInfo) {
        const { status } = error.response;
        throw new HttpException(error?.message, status);
      }
    }
  }

  public async currentSubscriptionIsRM(
    customer: CustomerDocument,
  ): Promise<boolean> {
    const subscriptions = await this.getOnlySubscriptionsFromCustomerEmail(
      customer.email,
    );

    const rmPlans = await this.cmsService.getReferralMarketingPlans();

    return subscriptions.some((subscription) => {
      const { product } = subscription;
      const isActive =
        subscription.state === State.ACTIVE ||
        subscription.state === State.TRIALING;

      const isRmProductFamily = rmPlans.includes(product.product_family.handle);

      return isActive && isRmProductFamily;
    });
  }

  public async getInvoicesFromASubscription(
    subscription: Subscription,
  ): Promise<InvoiceList> {
    const params = paramsStringify({
      subscription_id: subscription.id,
      payments: true,
    });

    const url = `${ROUTE_INVOICE_LIST}?${params}`;
    return this.find<InvoiceList>(url);
  }

  public async refundInvoice(dto: InvoiceRefundDTO): Promise<Invoice> {
    const { invoice_uid, ...rest } = dto;
    const url = replaceRouteParameter(
      ROUTE_INVOICE_REFUND,
      ':uid',
      invoice_uid,
    );

    return this.generalCreate<Invoice>(url, { refund: rest });
  }

  public async tryAutoRefundInvoiceAuthorify(
    subscription: Subscription,
  ): Promise<void | Array<Invoice>> {
    if (!isQAEmailAuthorify(subscription?.customer?.email)) {
      return;
    }

    const { invoices } = await this.getInvoicesFromASubscription(subscription);
    const paidInvoicesWithPayments = invoices.filter(
      (invoice) => invoice.status === 'paid' && invoice.payments?.length > 0,
    );

    const allRefunds: Array<Promise<Invoice>> = [];

    for (const invoice of paidInvoicesWithPayments) {
      for (const payment of invoice.payments) {
        const dto: InvoiceRefundDTO = {
          payment_id: payment.transaction_id,
          invoice_uid: invoice.uid,
          amount: payment.applied_amount,
          memo: 'AutoRefund for Authorify subscription',
        };

        allRefunds.push(this.refundInvoice(dto));
      }
    }

    return Promise.all(allRefunds);
  }

  public async checkCustomerSubscriptionType(
    customer: CustomerDocument,
  ): Promise<PlanTypes> {
    const plansType: PlanTypes = {
      isAfy: false,
      isRm: false,
      // @TODO implement this when is needed
      isDentist: false,
    };

    try {
      const subscriptions =
        await this.getAllActiveSubscriptionsFromCustomerEmail(customer.email);

      if (!subscriptions || !subscriptions?.length) {
        return plansType;
      }

      if (subscriptions?.length) {
        const { value: appConfig } = await this.cmsService.getUiConfig();
        const { RMM_MARKETING_PLANS, AFY_PLANS } = appConfig;

        const isAuthorify = subscriptions.some((sub) =>
          AFY_PLANS.includes(sub.product.product_family.handle),
        );
        const isRm = subscriptions.some((sub) =>
          RMM_MARKETING_PLANS.includes(sub.product.product_family.handle),
        );

        return {
          isAfy: isAuthorify,
          isRm: isRm,
          // @TODO implement this when is needed
          isDentist: false,
        };
      }
    } catch (error) {
      return plansType;
    }
  }
}

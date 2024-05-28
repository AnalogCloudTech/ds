import { CreateSubscriptionDto } from '../dto/subscription.dto';
import { PaymentGateway } from './payment-gateway.interface';
import { Stripe as StripeLib } from 'stripe';
import { Customer } from '../dto/customer.dto';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { get, isEmpty, map } from 'lodash';

export enum PaymentBehavior {
  allowIncomplete = 'allow_incomplete',
  errorIfIncomplete = 'error_if_incomplete',
  pendingIfIncomplete = 'pending_if_incomplete',
  defaultIncomplete = 'default_incomplete',
}

@Injectable()
/**
 * @deprecated
 */
export class Stripe implements PaymentGateway {
  private stripe: StripeLib;

  constructor(@Inject('STRIPE_SECRET_KEY') apiKey: string) {
    this.stripe = new StripeLib(apiKey, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      apiVersion: '2019-05-16',
      typescript: true,
    });
  }

  async findCustomerById(
    customerId: string,
  ): Promise<
    StripeLib.Response<StripeLib.Customer | StripeLib.DeletedCustomer>
  > {
    if (!customerId) {
      throw new HttpException(
        { message: 'no customer id was provided' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.stripe.customers.retrieve(customerId);
  }

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    const subscriptionData = this.buildSubscriptionObject(
      createSubscriptionDto,
    );

    const stripeSubscription = await this.stripe.subscriptions.create(
      subscriptionData,
    );

    const { metadata } = subscriptionData;

    if (!isEmpty(metadata)) {
      const paymentIntentId: string = get(stripeSubscription, [
        'latest_invoice',
        'payment_intent',
        'id',
      ]);
      if (paymentIntentId) {
        await this.stripe.paymentIntents.update(paymentIntentId, { metadata });
      }
    }

    const subscriptionId: string = get(subscriptionData, 'id');

    const clientSecret: string = get(stripeSubscription, [
      'latest_invoice',
      'payment_intent',
      'client_secret',
    ]);

    return {
      subscriptionId,
      clientSecret,
    };
  }

  updateSubscription(
    subscriptionId: string,
    items: StripeLib.SubscriptionUpdateParams.Item[],
    otherParams?: StripeLib.SubscriptionUpdateParams,
  ) {
    const params: StripeLib.SubscriptionUpdateParams = {
      items,
      ...otherParams,
    };
    return this.stripe.subscriptions.update(subscriptionId, params);
  }

  getSubscription(id: string) {
    return this.stripe.subscriptions.retrieve(id);
  }

  getUpcomingInvoice(subId: string, items, date: number, trialEnd?: number) {
    const params: StripeLib.InvoiceRetrieveUpcomingParams = {
      subscription: subId,
      subscription_items: items,
      subscription_proration_date: date,
      subscription_billing_cycle_anchor: 'now',
    };
    if (trialEnd) {
      params.subscription_trial_end = trialEnd;
    }
    return this.stripe.invoices.retrieveUpcoming(params);
  }

  getCustomer(id: string) {
    return this.stripe.customers.retrieve(id);
  }

  updateCustomer(id: string, customer: Customer) {
    const data: StripeLib.CustomerUpdateParams = {
      address: customer.address,
      metadata: customer.metadata,
      shipping: {
        address: customer.address,
        name: customer.name,
      },
      invoice_settings: {
        default_payment_method: get(
          customer,
          'invoice_settings.default_payment_method',
          null,
        ),
      },
    };
    return this.stripe.customers.update(id, data);
  }

  async findCustomerByEmail(email: string) {
    if (!email) {
      throw new HttpException(
        { message: 'No email was provided' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const params: StripeLib.CustomerListParams = {
      limit: 1,
      email: email,
    };
    const response = await this.stripe.customers.list(params);
    return response.data[0];
  }

  createCustomer(customer: Customer) {
    const params: StripeLib.CustomerCreateParams = customer;
    params.shipping = {
      address: customer.address,
      name: customer.name,
    };
    return this.stripe.customers.create(params);
  }

  async getPaymentMethods(
    customerId: string,
    type?: StripeLib.PaymentMethodListParams.Type,
  ) {
    const params: StripeLib.PaymentMethodListParams = {
      type: type || 'card',
    };
    const paymentMethods = await this.stripe.customers.listPaymentMethods(
      customerId,
      params,
    );
    return paymentMethods.data;
  }

  getAllPaymentIntents(customerId): Promise<StripeLib.PaymentIntent[]> {
    const func = this.stripe.paymentIntents.list;
    const params: StripeLib.PaymentIntentListParams = {
      customer: customerId,
      limit: 100,
    };
    return this.paginate(func, params);
  }

  getAllInvoices(
    customerId: string,
    status: StripeLib.InvoiceListParams.Status = 'paid',
  ): Promise<StripeLib.Invoice[]> {
    const func = this.getListInvoices;
    const params: StripeLib.InvoiceListParams = {
      customer: customerId,
      limit: 100,
      status,
    };
    return this.paginate(func, params);
  }

  public cancelSubscription(
    id: string,
  ): Promise<StripeLib.Response<StripeLib.Subscription>> {
    return this.stripe.subscriptions.cancel(id);
  }

  private getListInvoices(params: StripeLib.InvoiceListParams) {
    return this.stripe.invoices.list(params);
  }

  private async paginate(
    func: (arg0: any) => StripeLib.ApiListPromise<any>,
    params: any = {},
  ) {
    let pages = [];
    const request = await func.call(this, params);
    pages = [...request.data];
    if (request.has_more) {
      const lastItemId = get(request, ['data', request.data.length - 1, 'id']);
      params.starting_after = lastItemId;
      const nextPage = await this.paginate(func, params);
      pages = [...pages, ...nextPage];
    }
    return pages;
  }

  private buildSubscriptionObject(
    createSubscriptionDto: CreateSubscriptionDto,
  ): StripeLib.SubscriptionCreateParams {
    const { customerId, products, oneTimeProducts, trialPeriod, metadata } =
      createSubscriptionDto;

    const items = products.map((product) => ({
      price: product.id,
    }));

    const oneTimeItems = map(oneTimeProducts, (product) => ({
      price: product.id,
      quantity: product.quantity,
    }));

    return {
      customer: customerId,
      items,
      add_invoice_items: oneTimeItems,
      payment_behavior: PaymentBehavior.defaultIncomplete,
      expand: ['latest_invoice.payment_intent'],
      trial_period_days: trialPeriod,
      automatic_tax: {
        enabled: true,
      },
      metadata: metadata || {},
    };
  }
}

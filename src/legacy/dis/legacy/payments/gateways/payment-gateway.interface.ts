import { Stripe as StripeLib } from 'stripe';
import { CreateSubscriptionDto } from '../dto/subscription.dto';
import { Customer } from '../dto/customer.dto';
import { PaymentMethodTypes } from '../dto/payment-method.dto';

/**
 * @deprecated
 */
export interface PaymentGateway {
  createSubscription(createSubscriptionDto: CreateSubscriptionDto);
  getCustomer(id: string);
  updateCustomer(id: string, customer: Customer);
  findCustomerByEmail(email: string): Promise<StripeLib.Customer>;
  findCustomerById(
    customerId: string,
  ): Promise<
    StripeLib.Response<StripeLib.Customer | StripeLib.DeletedCustomer>
  >;
  createCustomer(customer: Customer);
  getPaymentMethods(
    customerId: string,
    type?: PaymentMethodTypes,
  ): Promise<StripeLib.PaymentMethod[]>;
  getAllInvoices(
    customerId: string,
    status?: StripeLib.InvoiceListParams.Status,
  ): Promise<StripeLib.Invoice[]>;
  getSubscription(
    id: string,
  ): Promise<StripeLib.Response<StripeLib.Subscription>>;
  getUpcomingInvoice(
    SubscriptionId: string,
    items: StripeLib.InvoiceRetrieveUpcomingParams.InvoiceItem[],
    date: number,
    trialEnd?: number,
  ): Promise<StripeLib.Response<StripeLib.Invoice>>;
  updateSubscription(
    subscriptionId: string,
    items: StripeLib.SubscriptionUpdateParams.Item[],
    otherParams?: StripeLib.SubscriptionUpdateParams,
  ): Promise<StripeLib.Response<StripeLib.Subscription>>;
  cancelSubscription(
    subscriptionId: string,
  ): Promise<StripeLib.Response<StripeLib.Subscription>>;
}

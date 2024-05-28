import { CreateSubscriptionDto } from '../dto/subscription.dto';
import { PaymentGateway } from './payment-gateway.interface';
import { Stripe as StripeLib } from 'stripe';
import { Customer } from '../dto/customer.dto';
export declare enum PaymentBehavior {
    allowIncomplete = "allow_incomplete",
    errorIfIncomplete = "error_if_incomplete",
    pendingIfIncomplete = "pending_if_incomplete",
    defaultIncomplete = "default_incomplete"
}
export declare class Stripe implements PaymentGateway {
    private stripe;
    constructor(apiKey: string);
    findCustomerById(customerId: string): Promise<StripeLib.Response<StripeLib.Customer | StripeLib.DeletedCustomer>>;
    createSubscription(createSubscriptionDto: CreateSubscriptionDto): Promise<{
        subscriptionId: string;
        clientSecret: string;
    }>;
    updateSubscription(subscriptionId: string, items: StripeLib.SubscriptionUpdateParams.Item[], otherParams?: StripeLib.SubscriptionUpdateParams): Promise<StripeLib.Response<StripeLib.Subscription>>;
    getSubscription(id: string): Promise<StripeLib.Response<StripeLib.Subscription>>;
    getUpcomingInvoice(subId: string, items: any, date: number, trialEnd?: number): Promise<StripeLib.Response<StripeLib.Invoice>>;
    getCustomer(id: string): Promise<StripeLib.Response<StripeLib.Customer | StripeLib.DeletedCustomer>>;
    updateCustomer(id: string, customer: Customer): Promise<StripeLib.Response<StripeLib.Customer>>;
    findCustomerByEmail(email: string): Promise<StripeLib.Customer>;
    createCustomer(customer: Customer): Promise<StripeLib.Response<StripeLib.Customer>>;
    getPaymentMethods(customerId: string, type?: StripeLib.PaymentMethodListParams.Type): Promise<StripeLib.PaymentMethod[]>;
    getAllPaymentIntents(customerId: any): Promise<StripeLib.PaymentIntent[]>;
    getAllInvoices(customerId: string, status?: StripeLib.InvoiceListParams.Status): Promise<StripeLib.Invoice[]>;
    cancelSubscription(id: string): Promise<StripeLib.Response<StripeLib.Subscription>>;
    private getListInvoices;
    private paginate;
    private buildSubscriptionObject;
}

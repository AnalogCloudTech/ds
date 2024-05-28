import { Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { ClickFunnelsContactInfo, ClickFunnelsPayload, Customer, InvoiceIssuedPayload, RenewalSuccessPayload, Subscription, SubscriptionPayload, SubscriptionUpdated, SubscriptionUpdatedComponentTypes, SubscriptionUpdatedPayload, WebhookPayload } from '@/payments/chargify/domain/types';
import { CustomerSubscriptionDocument } from '@/customers/customers/schemas/customer-subscription.schema';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { CustomersService } from '@/customers/customers/customers.service';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
import { ProductsService } from '@/onboard/products/products.service';
import { ProductDocument } from '@/onboard/products/schemas/product.schema';
import { CmsService } from '@/cms/cms/cms.service';
import { OnboardService } from '@/onboard/onboard.service';
import { CustomerEventsService } from '@/customers/customer-events/customer-events.service';
import { CreateCustomerEventDto } from '@/customers/customer-events/dto/create-customer-event.dto';
import { PaymentsService } from '@/legacy/dis/legacy/payments/payments.service';
import { HubspotSyncActionsServices } from '@/legacy/dis/legacy/hubspot/hubspot-sync-actions.services';
import { Queue } from 'bull';
import { ContactV1 } from '@/legacy/dis/legacy/hubspot/domain/types';
import { AfyNotificationsService } from '@/integrations/afy-notifications/afy-notifications.service';
import AfyLoggerService from '@/integrations/afy-logger/afy-logger.service';
export declare class WebhookService {
    private readonly hubspotService;
    private customersService;
    private paymentChargify;
    private productsService;
    private readonly logger;
    private readonly cmsService;
    private readonly onboardService;
    private readonly customerEventsService;
    private readonly stripeService;
    private readonly hubspotSyncActionsService;
    private readonly afyNotificationsService;
    private readonly queue;
    private readonly afyLoggerService;
    constructor(hubspotService: HubspotService, customersService: CustomersService, paymentChargify: PaymentChargifyService, productsService: ProductsService, logger: Logger, cmsService: CmsService, onboardService: OnboardService, customerEventsService: CustomerEventsService, stripeService: PaymentsService, hubspotSyncActionsService: HubspotSyncActionsServices, afyNotificationsService: AfyNotificationsService, queue: Queue, afyLoggerService: AfyLoggerService);
    handleSubscriptionStateChange(subscription: Subscription): Promise<void>;
    handleStateToActiveSubscription(subscription: Subscription): Promise<void>;
    handleCancelSubscription(subscription: Subscription): Promise<void>;
    handlePastDueSubscription(subscription: Subscription): Promise<void>;
    handleExpireCard(subscription: Subscription): Promise<{
        Message: string;
    }>;
    handleDeleteSubscription(subscription: Subscription): Promise<void>;
    handlePaymentFailure(body: WebhookPayload<SubscriptionPayload>): Promise<void>;
    customerSubscribeorUnSubscribe(subscription: Subscription): Promise<CustomerSubscriptionDocument>;
    isAllocationIncreasing(previousAllocation: number, newAllocation: number): number;
    getCustomerLifeCycle(dealsCount: number): "customer" | "subscriber";
    getDealName(status: string, name: string, productName: string): string;
    isCreditsAvailable(creditsOnce: number, creditsRecur: number): number;
    handleSubscriptionUpdate(payload: SubscriptionUpdatedPayload): Promise<void>;
    rewiseDeAllocation(component: SubscriptionUpdatedComponentTypes, customer: Customer, current_period_ends_at: string, subscription: SubscriptionUpdated): Promise<void>;
    sendEmail(email: string): Promise<string[]>;
    getPackageCreditsData(user: ContactV1, productObj: ProductDocument, subscription: Subscription, upateSubscription: SubscriptionUpdated): Promise<{
        properties: {};
    }>;
    getCreditsReduceData(user: ContactV1, productObj: ProductDocument, current_period_ends_at: string, subscription: SubscriptionUpdated): Promise<{
        properties: {};
    }>;
    updateCustomerLifeCycle(email: string, stage?: string): Promise<void>;
    verifyRmmSubscription(body: WebhookPayload<SubscriptionPayload>): Promise<{
        message: string;
    }>;
    invoiceIssued(body: WebhookPayload<InvoiceIssuedPayload>): Promise<any>;
    renewalSuccess(body: WebhookPayload<RenewalSuccessPayload>): Promise<void>;
    getAllTransactionBySubscriptionId(subscription: Subscription, queryParams: object, newCredits: number, perPage?: number, page?: number): Promise<void>;
    handlePaymentSuccess(body: WebhookPayload<SubscriptionPayload>): Promise<{
        message: string;
    }>;
    formatUserProperties(contactData: ClickFunnelsContactInfo): Promise<Record<string, any>[]>;
    clickfunnel(body: ClickFunnelsPayload): Promise<void>;
    stripeSubscriptionSuccess(body: Stripe.Event): Promise<void>;
    chargifyWebhookActivity(customerEmail: string, dto: CreateCustomerEventDto, body: {
        [key: string]: any;
    }): Promise<void>;
    handleBillingDateChange(req: WebhookPayload<SubscriptionPayload>): Promise<void>;
}

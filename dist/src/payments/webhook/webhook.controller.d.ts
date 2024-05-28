import { Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { WebhookService } from './webhook.service';
import { ClickFunnelsPayload, InvoiceIssuedPayload, RenewalSuccessPayload, SubscriptionPayload, SubscriptionUpdatedPayload, WebhookPayload } from '@/payments/chargify/domain/types';
import AfyLoggerService from '@/integrations/afy-logger/afy-logger.service';
export declare class WebhookController {
    private readonly webhookService;
    private readonly loggerServices;
    private readonly logger;
    constructor(webhookService: WebhookService, loggerServices: AfyLoggerService, logger: Logger);
    expiringCard(body: WebhookPayload<SubscriptionPayload>): Promise<{
        Message: string;
    }>;
    subscriptionStateChange(body: WebhookPayload<SubscriptionPayload>): Promise<void>;
    subscriptionUpdated(body: WebhookPayload<SubscriptionUpdatedPayload>): Promise<void>;
    paymentFailure(body: WebhookPayload<SubscriptionPayload>): Promise<void>;
    verifyRmmSubscription(body: WebhookPayload<SubscriptionPayload>): Promise<{
        message: string;
    }>;
    paymentSuccess(body: WebhookPayload<SubscriptionPayload>): Promise<true | {
        message: string;
    }>;
    invoiceIssued(body: WebhookPayload<InvoiceIssuedPayload>): Promise<any>;
    renewalSuccess(body: WebhookPayload<RenewalSuccessPayload>): Promise<void>;
    clickFunnels(body: ClickFunnelsPayload): Promise<void>;
    handleStripeSubscriptionSuccess(body: Stripe.Event, apiKey: string): Promise<void>;
    handleBillingDateChange(body: WebhookPayload<SubscriptionPayload>): Promise<void>;
}

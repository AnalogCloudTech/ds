import { Logger } from '@nestjs/common';
import { SubscriptionPayload, WebhookPayload } from '@/payments/chargify/domain/types';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
import { AfyPaymentsServices } from '@/integrations/afy-payments/afy-payments.services';
import { WebhookService } from '@/payments/webhook/webhook.service';
import { OnboardService } from '@/onboard/onboard.service';
export declare class PaymentEventsController {
    private readonly logger;
    private readonly paymentChargifyServices;
    private readonly afyPaymentsServices;
    private readonly webhookServices;
    private readonly onBoardService;
    constructor(logger: Logger, paymentChargifyServices: PaymentChargifyService, afyPaymentsServices: AfyPaymentsServices, webhookServices: WebhookService, onBoardService: OnboardService);
    handlePaymentSuccessEvent(data: WebhookPayload<SubscriptionPayload>): Promise<true | void>;
    handleSignupSuccessEvent(data: WebhookPayload<SubscriptionPayload>): Promise<void>;
}

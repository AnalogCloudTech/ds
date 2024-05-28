import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
export declare class OnboardingWebhookSessionGuard implements CanActivate {
    private readonly paymentChargify;
    constructor(paymentChargify: PaymentChargifyService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class PaymentWebhookSessionGuard implements CanActivate {
    private readonly paymentChargify;
    constructor(paymentChargify: PaymentChargifyService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

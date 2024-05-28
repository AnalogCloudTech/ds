import { Logger } from '@nestjs/common';
import { OnboardService } from '@/onboard/onboard.service';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
import { SessionService } from '@/onboard/services/session.service';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
export declare class OnboardScheduler {
    private readonly onboardService;
    private readonly sessionService;
    private readonly paymentChargifyService;
    private readonly hubspotService;
    private readonly logger;
    constructor(onboardService: OnboardService, sessionService: SessionService, paymentChargifyService: PaymentChargifyService, hubspotService: HubspotService, logger: Logger);
    syncCustomerLastStepHubspot(): Promise<void>;
}

import {
  Body,
  Controller,
  Logger,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiKeyOnly } from '@/auth/auth.service';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import {
  SubscriptionPayload,
  WebhookPayload,
} from '@/payments/chargify/domain/types';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
import { AfyPaymentsServices } from '@/integrations/afy-payments/afy-payments.services';
import { SchemaId } from '@/internal/types/helpers';
import { WebhookService } from '@/payments/webhook/webhook.service';
import { OfferDocument } from '@/onboard/schemas/offer.schema';
import { OnboardService } from '@/onboard/onboard.service';
import { ForceRefundSubscriptionInterceptor } from '@/internal/inteceptors/force-refund-subscription.interceptor';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';

@Controller({ path: 'integrations/afy-payments/payment-events', version: '1' })
export class PaymentEventsController {
  constructor(
    private readonly logger: Logger,
    private readonly paymentChargifyServices: PaymentChargifyService,
    private readonly afyPaymentsServices: AfyPaymentsServices,
    private readonly webhookServices: WebhookService,
    private readonly onBoardService: OnboardService,
    private readonly hubspotService: HubspotService,
  ) {}

  @ApiKeyOnly()
  @UseInterceptors(ForceRefundSubscriptionInterceptor)
  @Post('payment-success')
  async handlePaymentSuccessEvent(
    @Body(ValidationTransformPipe) data: WebhookPayload<SubscriptionPayload>,
  ) {
    if (
      data?.payload?.transaction?.kind === 'component_proration' &&
      data?.payload?.transaction?.transaction_type === 'payment'
    ) {
      // ignoring payment success if component allocation change happens
      return true;
    }

    this.paymentChargifyServices.sendSuccessPaymentEventToSocket({
      id: data.payload.subscription.id.toString(),
      email: data.payload.subscription.customer.email,
    });

    const chargifyDetails =
      await this.paymentChargifyServices.getComponentsFromSubscription(
        data.payload.subscription,
      );
    let isRecurring = false;
    if (chargifyDetails?.length > 0) {
      isRecurring = chargifyDetails[0].recurring;
    }
    if (!isRecurring) {
      return this.afyPaymentsServices.handleOneTimePaymentSuccessEvent(data);
    }

    const { metadata } =
      await this.paymentChargifyServices.getMetadataForResource(
        'subscriptions',
        data?.payload?.subscription?.id,
      );

    const isReferralMarketingPlan =
      await this.webhookServices.isReferalMarketingPlan(
        data?.payload?.subscription,
        data?.payload?.transaction,
      );
    if (isReferralMarketingPlan) {
      return { message: 'Not create a deal for referral marketing plan' };
    }
    if (metadata?.length === 0) {
      const deal = await this.hubspotService.getDealBySubscriptionId(
        data?.payload?.subscription?.id,
      );
      if (deal) {
        return { message: 'Deal already exists' };
      }
      await this.onBoardService.createHubspotDeal(
        data?.event,
        data?.payload?.subscription,
      );
    }
    const sessionMetadata = metadata?.find(
      (meta) => meta?.name === 'sessionId',
    );
    const offerMetadata = metadata?.find((meta) => meta?.name === 'offerId');
    const directSaleMetadata = metadata?.find(
      (meta) => meta?.name === 'directSale',
    );

    // ignoring if sessionId and offerId - this is from onboarding
    if (sessionMetadata && offerMetadata) {
      return;
    }
    if (directSaleMetadata) {
      await this.afyPaymentsServices.handleDirectSalePaymentSuccessEvent(
        data,
        offerMetadata,
      );

      return;
    }

    // processing upsell offer
    if (offerMetadata) {
      const session =
        await this.afyPaymentsServices.handleUpsellOfferPaymentSuccessEvent(
          data,
          offerMetadata,
        );

      await session.populate(['offer']);
      const offer = <OfferDocument>session.offer;

      this.paymentChargifyServices.sendSuccessUpsellPaymentEventToSocket({
        id: data.payload.subscription.id.toString(),
        email: data.payload.subscription.customer.email,
        sessionId: <SchemaId>session._id,
        offerCode: offer.code,
      });
    }
  }

  @ApiKeyOnly()
  @Post('/signup-success')
  async handleSignupSuccessEvent(
    @Body(ValidationTransformPipe) data: WebhookPayload<SubscriptionPayload>,
  ) {
    const isRM = await this.webhookServices.verifyRmmSubscription(data);
    if (isRM?.message) {
      this.paymentChargifyServices.sendRmSuccessEventToSocket({
        id: data.payload.subscription.id.toString(),
        email: data.payload.subscription.customer.email,
      });
    }
  }
}

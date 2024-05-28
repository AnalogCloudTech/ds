import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import Stripe from 'stripe';
import { WebhookService } from '../webhook.service';
import { WebhookIdempotencyGuard } from '@/onboard/guards/webhook-idempotency.guard';
import { PaymentWebhookSessionGuard } from '@/onboard/guards/onboarding-webhook.guard';
import { get } from 'lodash';
import {
  ClickFunnelsPayload,
  InvoiceIssuedPayload,
  RenewalSuccessPayload,
  State,
  Subscription,
  SubscriptionPayload,
  SubscriptionUpdatedPayload,
  WebhookPayload,
} from '@/payments/chargify/domain/types';
import { Public } from '@/auth/auth.service';
import AfyLoggerService from '@/integrations/afy-logger/afy-logger.service';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';
import { CONTEXT_ERROR } from '@/internal/common/contexts';
import { ForceRefundSubscriptionInterceptor } from '@/internal/inteceptors/force-refund-subscription.interceptor';

@Controller({ path: 'webhook', version: '1' })
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly loggerServices: AfyLoggerService,
    private readonly logger: Logger,
  ) {}

  @Public()
  @UseGuards(WebhookIdempotencyGuard)
  @UseGuards(PaymentWebhookSessionGuard)
  @Post('expiring-card')
  async expiringCard(@Body() body: WebhookPayload<SubscriptionPayload>) {
    const subscription = get(body, ['payload', 'subscription']);
    return await this.webhookService.handleExpireCard(subscription);
  }

  @Public()
  @UseGuards(WebhookIdempotencyGuard)
  @UseGuards(PaymentWebhookSessionGuard)
  @Post('subscription-state-change')
  async subscriptionStateChange(
    @Res() res: Response,
    @Body() body: WebhookPayload<SubscriptionPayload>,
  ) {
    const subscription: Subscription = get(body, ['payload', 'subscription']);

    // ignore if subscription state is not valid
    const validState = [
      State.ACTIVE,
      State.CANCELED,
      State.PAST_DUE,
      State.UNPAID,
    ];
    if (!validState.includes(subscription.state)) {
      this.logger.debug(
        `invalid subscription state. state: ${subscription.state}`,
      );
      res.status(HttpStatus.OK);
      return;
    }

    await this.webhookService.handleSubscriptionStateChange(subscription);

    if (
      subscription.previous_state === State.TRIALING &&
      subscription.state === State.ACTIVE
    ) {
      try {
        await this.loggerServices.sendLogTrialConversion(
          subscription,
          'become-member',
        );
      } catch (error) {
        if (error instanceof Error) {
          const { name, stack, message } = error;
          this.logger.error(
            {
              payload: <LoggerPayload>{
                usageDate: DateTime.now(),
                name,
                stack,
                message,
              },
            },
            stack,
            CONTEXT_ERROR,
          );
        }
      }
    }

    res.status(HttpStatus.OK);
  }

  @Public()
  @UseGuards(WebhookIdempotencyGuard)
  @UseGuards(PaymentWebhookSessionGuard)
  @Post('subscription-updated')
  async subscriptionUpdated(
    @Body() body: WebhookPayload<SubscriptionUpdatedPayload>,
  ) {
    const payload: SubscriptionUpdatedPayload = get(body, ['payload']);
    return await this.webhookService.handleSubscriptionUpdate(payload);
  }

  @Public()
  @UseGuards(WebhookIdempotencyGuard)
  @UseGuards(PaymentWebhookSessionGuard)
  @Post('payment-failure')
  paymentFailure(@Body() body: WebhookPayload<SubscriptionPayload>) {
    return this.webhookService.handlePaymentFailure(body);
  }

  @Public()
  @UseGuards(WebhookIdempotencyGuard)
  @Post('verify-rmm-subscription-webhook')
  verifyRmmSubscription(
    @Body(ValidationPipe) body: WebhookPayload<SubscriptionPayload>,
  ) {
    return this.webhookService.verifyRmmSubscription(body);
  }

  @Public()
  @UseGuards(WebhookIdempotencyGuard)
  @UseGuards(PaymentWebhookSessionGuard)
  @UseInterceptors(ForceRefundSubscriptionInterceptor)
  @Post('payment-success')
  async paymentSuccess(@Body() body: WebhookPayload<SubscriptionPayload>) {
    const availableFamilyHandles = [
      'click_funnel_family',
      'book_credits_family',
      'guide_credits_family',
      'dentistguide',
      'holiday_sale_credits',
    ];
    const familyHandle =
      body.payload.subscription.product.product_family.handle;
    if (availableFamilyHandles.includes(familyHandle)) {
      // ignoring payment success for clickfunnel and book credits
      return true;
    }

    if (
      body.payload.transaction.kind === 'component_proration' &&
      body.payload.transaction.transaction_type === 'payment'
    ) {
      // ignoring payment success if component allocation change happens
      return true;
    }

    const handle = await this.webhookService.handlePaymentSuccess(body);

    if (body.payload.subscription.state === State.TRIALING) {
      try {
        await this.loggerServices.sendLogTrialConversion(
          body.payload.subscription,
          'new-trial',
        );
      } catch (error) {
        if (error instanceof Error) {
          const { name, stack, message } = error;
          this.logger.error(
            {
              payload: <LoggerPayload>{
                usageDate: DateTime.now(),
                name,
                stack,
                message,
              },
            },
            stack,
            CONTEXT_ERROR,
          );
        }
      }
    }

    return handle;
  }

  @Public()
  @Post('invoice-issued')
  invoiceIssued(@Body() body: WebhookPayload<InvoiceIssuedPayload>) {
    return this.webhookService.invoiceIssued(body);
  }

  @Public()
  @UseGuards(WebhookIdempotencyGuard)
  @Post('renewal-success')
  renewalSuccess(@Body() body: WebhookPayload<RenewalSuccessPayload>) {
    return this.webhookService.renewalSuccess(body);
  }

  @Post('click-funnels')
  @Public()
  clickFunnels(@Body() body: ClickFunnelsPayload) {
    return this.webhookService.clickfunnel(body);
  }

  @Post('stripe-payment-success/:apiKey')
  @UseGuards(WebhookIdempotencyGuard)
  @Public()
  handleStripeSubscriptionSuccess(
    @Body(ValidationPipe) body: Stripe.Event,
    @Param('apiKey') apiKey: string,
  ) {
    if (!apiKey)
      throw new HttpException(
        { message: 'missing apiKey' },
        HttpStatus.BAD_REQUEST,
      );
    return this.webhookService.stripeSubscriptionSuccess(body);
  }

  @Post('billing-date-change')
  @UseGuards(WebhookIdempotencyGuard)
  @Public()
  handleBillingDateChange(@Body() body: WebhookPayload<SubscriptionPayload>) {
    return this.webhookService.handleBillingDateChange(body);
  }
}

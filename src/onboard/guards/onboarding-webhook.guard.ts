import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { get } from 'lodash';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
import {
  MetadataPaginationSchema,
  Subscription,
} from '@/payments/chargify/domain/types';

/**
 * Check whether webhook metadata includes sessionId key and.
 * If Not Return 200 and exit process.
 */
@Injectable()
export class OnboardingWebhookSessionGuard implements CanActivate {
  constructor(private readonly paymentChargify: PaymentChargifyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request<
      any,
      any,
      { sessionId?: string; resourceMetaData?: MetadataPaginationSchema }
    > = context.switchToHttp().getRequest();
    const subscription = <Subscription>(
      get(request, ['body', 'payload', 'subscription'])
    );

    const resourceMetaData = await this.paymentChargify.getMetadataForResource(
      'subscriptions',
      subscription.id,
    );

    const sessionId = resourceMetaData.metadata.find(
      (meta) => meta.name === 'sessionId',
    ).value;

    if (!sessionId) {
      throw new HttpException(
        {
          message:
            'Payment intent | subscription has no session id. process exited',
          ...subscription,
        },
        HttpStatus.OK,
      );
    }
    request.body.sessionId = sessionId;
    request.body.resourceMetaData = resourceMetaData;
    return true;
  }
}

@Injectable()
export class PaymentWebhookSessionGuard implements CanActivate {
  constructor(private readonly paymentChargify: PaymentChargifyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request<
      any,
      any,
      { sessionId?: string; resourceMetaData?: MetadataPaginationSchema }
    > = context.switchToHttp().getRequest();
    const subscription = <Subscription>(
      get(request, ['body', 'payload', 'subscription'])
    );

    const resourceMetaData = await this.paymentChargify.getMetadataForResource(
      'subscriptions',
      subscription?.id,
    );

    const sessionId = resourceMetaData?.metadata?.find(
      (meta) => meta.name === 'sessionId',
    );

    request.body.sessionId = sessionId?.value;
    request.body.resourceMetaData = resourceMetaData;
    return true;
  }
}

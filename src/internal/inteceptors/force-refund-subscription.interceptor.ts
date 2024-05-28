import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
import {
  SubscriptionPayload,
  WebhookPayload,
} from '@/payments/chargify/domain/types';
import { Request } from 'express';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';

@Injectable({ scope: Scope.REQUEST })
export class ForceRefundSubscriptionInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger(
    ForceRefundSubscriptionInterceptor.name,
  );

  constructor(
    private readonly paymentChargifyServices: PaymentChargifyService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // To fix that lint we need to go deeply into the nestjs observable implementation
    // Fixing this has nothing valuable to add to our business logic
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return next.handle().pipe(
      tap(async () => {
        let payload: SubscriptionPayload;
        try {
          const http = context.switchToHttp();
          const requestData = <WebhookPayload<SubscriptionPayload>>(
            http.getRequest<Request>().body
          );
          payload = requestData.payload;
          await this.paymentChargifyServices.tryAutoRefundInvoiceAuthorify(
            payload.subscription,
          );
        } catch (error) {
          if (error instanceof Error) {
            this.logger.error({
              payload: <LoggerPayload>{
                usageDate: DateTime.now(),
                error: error?.name,
                stack: error?.stack,
                message: error?.message,
                subscription: payload?.subscription,
                method: 'ForceRefundAuthorifySubscriptionInterceptor',
              },
            });
          }
        }
      }),
    );
  }
}

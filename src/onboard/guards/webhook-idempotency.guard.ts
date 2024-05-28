import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { OnboardService } from '../onboard.service';

@Injectable()
export class WebhookIdempotencyGuard implements CanActivate {
  constructor(private readonly service: OnboardService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const obj = request.body;
    const objectName = obj?.event || obj?.type;
    const possibleObjectTypes = [
      'payment_success',
      'payment_failure',
      'subscription_product_change',
      'subscription_state_change',
      'component_allocation_change',
      'signup_success',
      // stripe subscription payment success event
      'invoice.payment_succeeded',
      'renewal_success',
      'billing_date_change',
    ];
    const isPossibleObjectType = possibleObjectTypes.includes(objectName);
    if (!isPossibleObjectType) {
      throw new HttpException(null, HttpStatus.OK);
    }

    const eventId = <string>obj.id;
    if (!eventId) {
      throw new HttpException(null, HttpStatus.NO_CONTENT);
    }

    // TODO: this is a hack for now
    if (objectName === 'payment_method') {
      return true;
    }

    const isRepeated = await this.service.isRepeatedWebhookRequest(
      eventId,
      objectName,
    );
    if (isRepeated) {
      throw new HttpException(null, HttpStatus.OK);
    }
    return true;
  }
}

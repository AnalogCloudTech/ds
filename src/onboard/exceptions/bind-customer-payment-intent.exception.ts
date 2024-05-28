import { Logger } from '@nestjs/common';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';
import { CONTEXT_ERROR } from '@/internal/common/contexts';

export class BindCustomerPaymentIntentException extends Error {
  public readonly logger = new Logger(BindCustomerPaymentIntentException.name);

  constructor(
    message = 'Could not bind the payment intent to the customer',
    extraData?: object,
  ) {
    super(message);

    const { name, stack } = this;

    const payload: LoggerPayload = {
      usageDate: DateTime.now(),
      exception: BindCustomerPaymentIntentException.name,
      error: name,
      message,
      stack,
      ...extraData,
    };

    this.logger.error({ payload }, stack, CONTEXT_ERROR);
  }
}

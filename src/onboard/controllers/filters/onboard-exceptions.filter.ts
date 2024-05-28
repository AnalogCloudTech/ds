import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { BindCustomerPaymentIntentException } from '@/onboard/exceptions/bind-customer-payment-intent.exception';
import { StepResultException } from '@/onboard/exceptions/step-result.exception';

@Catch()
export class OnboardExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof BindCustomerPaymentIntentException) {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    if (exception instanceof StepResultException) {
      httpStatus = HttpStatus.PRECONDITION_FAILED;
    }

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: <string>httpAdapter.getRequestUrl(ctx.getRequest<Request>()),
      message: exception instanceof Error ? exception.message : exception,
    };

    httpAdapter.reply(ctx.getResponse<Response>(), responseBody, httpStatus);
  }
}

import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { get, map } from 'lodash';
import { CONTEXT_ERROR } from '../contexts';
import { CustomHttpExceptionResponse } from './models/httpExceptionResponse.interface';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';

enum ExceptionTypes {
  DIS = 'Dis',
  AXIOS = 'Axios',
  BAD_REQUEST = 'BadRequest',
  DEFAULT = 'Default',
  HTTP_EXCEPTION = 'HttpException',
  HUBSPOT = 'Hubspot',
  STRIPE = 'Stripe',
  GOOGLE = 'Google',
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { user, ip } = request;

    try {
      const exceptionType = this.getExceptionType(exception);
      const errorObject = <CustomHttpExceptionResponse>(
        this[`buildErrorObjectFor${exceptionType}`](exception, request)
      );
      const payload = <LoggerPayload>{
        ...errorObject,
        user,
        ip,
        usageDate: DateTime.now(),
      };
      this.logger.error({ payload }, '', CONTEXT_ERROR);
      response.status(errorObject.statusCode).json(payload);
    } catch (e) {
      const errorObject = this.buildErrorObjectForDefault(e, request);
      response.status(errorObject.statusCode).json(errorObject);
    }
  }

  private buildErrorObjectForBadRequest(
    exception,
    request: Request,
  ): CustomHttpExceptionResponse {
    const { response, status } = exception;
    const { method, url } = request;
    return {
      statusCode: status,
      error: response.error,
      errors: response.message,
      path: url,
      method: method,
      timestamp: new Date(),
      origin: 'DS',
    };
  }

  private buildErrorObjectForHttpException(
    exception,
    request: Request,
  ): CustomHttpExceptionResponse {
    const { message, name, status } = exception;
    const { method, url } = request;
    return {
      statusCode: status,
      error: name,
      errors: [message],
      path: url,
      method: method,
      timestamp: new Date(),
      origin: 'DS',
    };
  }

  private buildErrorObjectForDis(
    exception,
    request: Request,
  ): CustomHttpExceptionResponse {
    const jsonException = exception.toJSON();
    const innerError: CustomHttpExceptionResponse = get(
      exception,
      ['response', 'data'],
      {},
    );
    innerError.origin = 'DIS';
    const { status } = jsonException;
    const { method, url } = request;
    return {
      statusCode: status,
      error: 'DIS_ERROR',
      errors: ['request to DIS failed'],
      path: url,
      method: method,
      timestamp: new Date(),
      origin: 'DIS',
      innerError,
    };
  }

  private buildErrorObjectForAxios(
    exception,
    request: Request,
  ): CustomHttpExceptionResponse {
    const { statusText, config, response } = exception;
    const { method, url } = request;
    const statusCode = response ? response.status : 404;
    const errorMessage =
      response?.statusText || statusText || exception.message;
    const innerError: CustomHttpExceptionResponse = {
      statusCode,
      error: errorMessage,
      errors: [errorMessage],
      path: `${config.baseURL}${config.url}`,
      method: config.method,
      timestamp: new Date(),
      origin: 'Axios_request',
    };

    return {
      statusCode,
      error: 'AXIOS_ERROR',
      errors: [errorMessage],
      path: url,
      method: method,
      timestamp: new Date(),
      origin: 'Axios',
      innerError,
    };
  }

  private buildErrorObjectForDefault(
    exception,
    request: Request,
  ): CustomHttpExceptionResponse {
    const { stack, message, name } = exception;
    const { method, url } = request;
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: name,
      errors: [message],
      path: url,
      method: method,
      timestamp: new Date(),
      origin: 'DS',
      stack: stack,
    };
  }

  private buildErrorObjectForStripe(
    exception,
    request: Request,
  ): CustomHttpExceptionResponse {
    const { message, code } = exception.raw;
    const { method, url } = request;
    return {
      statusCode: exception.statusCode,
      error: code,
      errors: [message],
      path: url,
      method: method,
      timestamp: new Date(),
      origin: 'Stripe',
    };
  }

  private buildErrorObjectForHubspot(
    exception,
    request: Request,
  ): CustomHttpExceptionResponse {
    const jsonException = exception.response.toJSON();
    const { statusCode, body } = jsonException;
    const { method, url } = request;
    const innerError: CustomHttpExceptionResponse = {
      statusCode,
      error: body?.category,
      errors: [body?.message],
      path: url,
      method: method,
      timestamp: new Date(),
      origin: 'Hubspot',
    };

    return {
      statusCode,
      error: 'HUBSPOT_ERROR',
      errors: ['HUBSOPT API error'],
      path: url,
      method: method,
      timestamp: new Date(),
      origin: 'DIS',
      innerError,
    };
  }

  private buildErrorObjectForGoogle(
    exception,
    request: Request,
  ): CustomHttpExceptionResponse {
    const { config, response, code } = exception;
    const { method, url } = request;
    const error = get(response, ['data', 'error', 'message'], '');
    const errors = map(
      get(response, ['data', 'error', 'errors'], []),
      (error) => error.message,
    );
    const innerError: CustomHttpExceptionResponse = {
      statusCode: response.status,
      error: error,
      errors: errors,
      path: config.url,
      method: config.method,
      timestamp: new Date(),
      origin: 'Google_request',
    };

    return {
      statusCode: code,
      error: 'GOOGLE_ERROR',
      errors: ['Google API error'],
      path: url,
      method: method,
      timestamp: new Date(),
      origin: 'Google',
      innerError,
    };
  }

  private getExceptionType(exception: unknown): string {
    if (this.isDisException(exception)) {
      return ExceptionTypes.DIS;
    } else if (this.isGoogleError(exception)) {
      return ExceptionTypes.GOOGLE;
    } else if (this.isHubspotException(exception)) {
      return ExceptionTypes.HUBSPOT;
    } else if (this.isStripeError(exception)) {
      return ExceptionTypes.STRIPE;
    } else if (this.isAxiosError(exception)) {
      return ExceptionTypes.AXIOS;
    } else if (this.isBadRequest(exception)) {
      return ExceptionTypes.BAD_REQUEST;
    } else if (this.isHttpException(exception)) {
      return ExceptionTypes.HTTP_EXCEPTION;
    } else {
      return ExceptionTypes.DEFAULT;
    }
  }

  private isDisException(exception: unknown): boolean {
    const response = get(exception, ['response', 'data'], {});
    const { path, method, timestamp, origin } = response;
    if (path && method && timestamp && origin) {
      return true;
    }
    return false;
  }

  private isAxiosError(exception) {
    return exception.isAxiosError;
  }

  private isHttpException(exception) {
    return exception instanceof HttpException;
  }

  private isBadRequest(exception) {
    return exception instanceof BadRequestException;
  }

  private isGoogleError(exception: unknown): boolean {
    const url: string = get(exception, ['config', 'url'], '');
    return url.includes('googleapis.com');
  }

  private isHubspotException(exception: unknown): boolean {
    return get(exception, ['response', 'request', 'uri', 'hostname'], null) ===
      'api.hubapi.com'
      ? true
      : false;
  }

  private isStripeError(exception) {
    const stripeVersion = get(exception, ['raw', 'headers', 'stripe-version']);
    const requestId = get(exception, ['raw', 'requestId']);
    return Boolean(stripeVersion && requestId);
  }
}

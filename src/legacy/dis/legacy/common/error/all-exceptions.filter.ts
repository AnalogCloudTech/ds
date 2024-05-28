import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { get, map } from 'lodash';
import { CustomHttpExceptionResponse } from './models/httpExceptionResponse.interface';

enum ExceptionTypes {
  HUBSPOT = 'Hubspot',
  AXIOS = 'Axios',
  BAD_REQUEST = 'BadRequest',
  STRIPE = 'Stripe',
  GOOGLE = 'Google',
  DEFAULT = 'Default',
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    try {
      const exceptionType = this.getExceptionType(exception);
      const errorObject: CustomHttpExceptionResponse = this[
        `buildErrorObjectFor${exceptionType}`
      ](exception, request);

      response.status(errorObject.statusCode).json(errorObject);
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
      origin: 'DIS',
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
    return {
      statusCode,
      error: body.category,
      errors: [body.message],
      path: url,
      method: method,
      timestamp: new Date(),
      origin: 'Hubspot',
    };
  }

  private buildErrorObjectForDefault(
    exception,
    request: Request,
  ): CustomHttpExceptionResponse {
    const { stack, message, name } = exception;
    const { method, url } = request;
    const code =
      get(exception, ['response', 'statusCode']) ||
      get(exception, ['response', 'status']) ||
      get(exception, ['statusCode']) ||
      get(exception, ['code']) ||
      HttpStatus.INTERNAL_SERVER_ERROR;

    return {
      statusCode: code,
      error: name,
      errors: [message],
      path: url,
      method: method,
      timestamp: new Date(),
      origin: 'DIS',
      stack: stack,
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
    if (this.isHubspotException(exception)) {
      return ExceptionTypes.HUBSPOT;
    } else if (this.isAxiosError(exception)) {
      return ExceptionTypes.AXIOS;
    } else if (this.isBadRequest(exception)) {
      return ExceptionTypes.BAD_REQUEST;
    } else if (this.isStripeError(exception)) {
      return ExceptionTypes.STRIPE;
    } else if (this.isGoogleError(exception)) {
      return ExceptionTypes.GOOGLE;
    } else {
      return ExceptionTypes.DEFAULT;
    }
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

  private isAxiosError(exception) {
    return exception.isAxiosError;
  }

  private isBadRequest(exception) {
    return exception instanceof BadRequestException;
  }

  private isStripeError(exception) {
    const stripeVersion = get(exception, ['raw', 'headers', 'stripe-version']);
    const requestId = get(exception, ['raw', 'requestId']);
    return Boolean(stripeVersion && requestId);
  }
}

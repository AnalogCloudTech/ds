import { ArgumentsHost, ExceptionFilter, Logger } from '@nestjs/common';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger;
    constructor(logger: Logger);
    catch(exception: unknown, host: ArgumentsHost): void;
    private buildErrorObjectForBadRequest;
    private buildErrorObjectForHttpException;
    private buildErrorObjectForDis;
    private buildErrorObjectForAxios;
    private buildErrorObjectForDefault;
    private buildErrorObjectForStripe;
    private buildErrorObjectForHubspot;
    private buildErrorObjectForGoogle;
    private getExceptionType;
    private isDisException;
    private isAxiosError;
    private isHttpException;
    private isBadRequest;
    private isGoogleError;
    private isHubspotException;
    private isStripeError;
}

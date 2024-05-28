import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
    private buildErrorObjectForBadRequest;
    private buildErrorObjectForAxios;
    private buildErrorObjectForStripe;
    private buildErrorObjectForHubspot;
    private buildErrorObjectForDefault;
    private buildErrorObjectForGoogle;
    private getExceptionType;
    private isGoogleError;
    private isHubspotException;
    private isAxiosError;
    private isBadRequest;
    private isStripeError;
}

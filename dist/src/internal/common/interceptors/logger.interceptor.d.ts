import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
export declare class LoggerInterceptor implements NestInterceptor {
    private readonly logger;
    intercept(context: ExecutionContext, next: CallHandler): import("rxjs").Observable<any>;
}

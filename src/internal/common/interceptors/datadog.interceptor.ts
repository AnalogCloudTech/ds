import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { catchError, finalize, Observable, throwError } from 'rxjs';

import tracer from 'dd-trace';

@Injectable({ scope: Scope.REQUEST })
export class DatadogInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const request = ctx.switchToHttp().getRequest();

    if (request?.user) {
      const {
        userId,
        email,
        isAdmin,
        isPilotCustomer,
        role,
        hasSocialMediaTrainingAccess,
      } = request.user;

      tracer.setUser({
        id: userId,
        email,
        isAdmin,
        isPilotCustomer,
        role,
        hasSocialMediaTrainingAccess,
      });
    }

    const span = tracer.scope().active();

    return next.handle().pipe(
      catchError((err: any) => {
        const ignoreErrors = [
          HttpStatus.NOT_FOUND,
          HttpStatus.OK,
          HttpStatus.ACCEPTED,
        ];

        if (!ignoreErrors.includes(err?.status) && span) {
          span.setTag('error', err);
        }
        return throwError(() => err);
      }),
      finalize(() => {
        if (span) {
          span.finish();
        }
      }),
    );
  }
}

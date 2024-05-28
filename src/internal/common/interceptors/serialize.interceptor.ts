import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ClassConstructor,
  plainToInstance,
  Transform,
} from 'class-transformer';

/*
 * DISCLAIMER: this is a workaround since class-transformer re-instantiate the values
 * ref: https://github.com/typestack/class-transformer/issues/494
 * */
export function ExposeId() {
  return Transform(
    ({ key, obj }) => {
      if (key === 'id') {
        key = '_id';
      }
      return obj[key]?._id || obj[key];
    },
    {
      toClassOnly: true,
    },
  );
}

export function resolverSerializer<T>(
  Domain: ClassConstructor<T>,
  rawData: any,
): any {
  try {
    const data = rawData.data || rawData;

    const castedData = data.length
      ? data.map((d) =>
          plainToInstance(Domain, d, {
            excludeExtraneousValues: true,
          }),
        )
      : plainToInstance(Domain, data, {
          excludeExtraneousValues: true,
        });

    if (Array.isArray(rawData.data)) {
      return {
        ...rawData,
        data: castedData,
      };
    }
    return castedData;
  } catch (err) {
    throw new Error('error in object serialization');
  }
}

export function Serialize(domain: any) {
  return UseInterceptors(new SerializeInterceptor(domain));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private domain: ClassConstructor<any>) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(
        map((rawData: any) => resolverSerializer<any>(this.domain, rawData)),
      );
  }
}

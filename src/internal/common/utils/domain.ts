import { Type } from '@nestjs/common';

export abstract class CastableTo<T> {
  castTo: (cls: Type<T>) => T;
}

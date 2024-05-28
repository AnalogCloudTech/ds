import { Type } from '@nestjs/common';
export declare abstract class CastableTo<T> {
    castTo: (cls: Type<T>) => T;
}

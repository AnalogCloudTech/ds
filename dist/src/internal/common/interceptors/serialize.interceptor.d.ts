import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClassConstructor } from 'class-transformer';
export declare function ExposeId(): PropertyDecorator;
export declare function resolverSerializer<T>(Domain: ClassConstructor<T>, rawData: any): any;
export declare function Serialize(domain: any): MethodDecorator & ClassDecorator;
export declare class SerializeInterceptor implements NestInterceptor {
    private domain;
    constructor(domain: ClassConstructor<any>);
    intercept(_context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>>;
}

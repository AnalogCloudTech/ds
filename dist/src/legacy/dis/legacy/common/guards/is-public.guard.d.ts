import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class IsPublicGuard implements CanActivate {
    private readonly reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

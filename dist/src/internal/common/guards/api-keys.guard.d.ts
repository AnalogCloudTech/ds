import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { Reflector } from '@nestjs/core';
export declare class ApiKeysGuard implements CanActivate {
    private readonly reflector;
    private readonly authService;
    constructor(reflector: Reflector, authService: AuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

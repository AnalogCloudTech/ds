import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  API_KEY_PREFIX,
  AuthService,
  IS_APIKEY_ONLY_KEY,
  IS_PUBLIC_KEY,
} from '@/auth/auth.service';

import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiKeysGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authorization =
      request.query?.apiKey || request.headers.authorization;
    const isApiKeyOnly = this.reflector.getAllAndOverride<boolean>(
      IS_APIKEY_ONLY_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!authorization) {
      return !isApiKeyOnly;
    }
    if (!authorization.toLowerCase().startsWith(API_KEY_PREFIX)) {
      // has authorization header but pass to next guard
      return true;
    }
    const prefixRegexp = new RegExp(API_KEY_PREFIX, 'i');
    const apiKey = authorization.replace(prefixRegexp, '');
    const trimmedApiKey = apiKey.trim();
    if (!trimmedApiKey) {
      return true;
    }

    const result = await this.authService.validateApiKey(trimmedApiKey);
    return Boolean(result);
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  AuthService,
  API_KEY_PREFIX,
  IS_APIKEY_ONLY_KEY,
} from '@/auth/auth.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiKeysGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization || request.query.apiKey;
    const isApiKeyOnly = this.reflector.getAllAndOverride<boolean>(
      IS_APIKEY_ONLY_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!authorization) {
      return !isApiKeyOnly;
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

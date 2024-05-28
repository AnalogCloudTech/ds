import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '@/auth/auth.service';

@Injectable()
export class IsPublicGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authorizationKey =
      request.headers.authorization || request.query.apiKey;
    const token = request.query.token;
    return Boolean(authorizationKey || token);
  }
}

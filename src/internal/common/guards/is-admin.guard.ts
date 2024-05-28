import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { API_KEY_PREFIX } from '@/auth/auth.service';
import { Request } from 'express';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private readonly hubspotService: HubspotService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request & { user: { email: string } }>();
    const headers = request.headers;

    if (headers?.authorization?.includes(API_KEY_PREFIX)) {
      return Promise.resolve(true);
    }

    const {
      user: { email },
    } = request;

    return this.hubspotService.isAdminByEmail(email);
  }
}

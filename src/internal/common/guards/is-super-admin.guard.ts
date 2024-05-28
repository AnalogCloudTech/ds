import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';

@Injectable()
export class IsSuperAdminGuard implements CanActivate {
  constructor(private readonly hubspotService: HubspotService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const {
      user: { email },
    } = request;

    return this.hubspotService.isSuperAdminByEmail(email);
  }
}

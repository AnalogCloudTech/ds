import { CanActivate, ExecutionContext } from '@nestjs/common';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
export declare class IsSuperAdminGuard implements CanActivate {
    private readonly hubspotService;
    constructor(hubspotService: HubspotService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

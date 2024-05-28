import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class CanAccessEmailCampaignsModuleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}

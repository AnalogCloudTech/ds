import { CanActivate, ExecutionContext } from '@nestjs/common';
import { OnboardService } from '../onboard.service';
export declare class OfferGuard implements CanActivate {
    private readonly service;
    constructor(service: OnboardService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

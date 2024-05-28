import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { get } from 'lodash';

@Injectable()
export class CanAccessEmailCampaignsModuleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const isPilotCustomer = get(
      context.switchToHttp().getRequest(),
      ['user', 'isPilotCustomer'],
      false,
    );

    return isPilotCustomer;
  }
}

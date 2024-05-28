import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { CustomersService } from '@/customers/customers/customers.service';
import { get } from 'lodash';

@Injectable()
export class VerifiedEmailGuard implements CanActivate {
  constructor(
    private readonly sesService: SesService,
    private readonly customersService: CustomersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const identities = <Array<string>>user.identities;
    const customer = await this.customersService.findByIdentities(identities);
    const email = get(customer, ['attributes', 'email']);
    const isVerified = await this.sesService.emailIsVerified(email);

    if (!isVerified) {
      throw new ForbiddenException('Identity not verified');
    }

    return true;
  }
}

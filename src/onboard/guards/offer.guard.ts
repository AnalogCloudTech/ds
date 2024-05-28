import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { OfferCode } from '../domain/types';
import { OnboardService } from '../onboard.service';

@Injectable()
export class OfferGuard implements CanActivate {
  constructor(private readonly service: OnboardService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const offerCode: OfferCode = request.query.offerCode?.toString();
    const offerExists = await this.service.offerExists(offerCode);

    if (!offerExists) {
      throw new HttpException(
        'Incorrect OfferCode',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return true;
  }
}

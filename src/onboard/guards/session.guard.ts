import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { OfferCode, SessionId } from '../domain/types';
import { OnboardService } from '../onboard.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly service: OnboardService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const sessionId: SessionId = request.query.sessionId?.toString();
    const offerCode: OfferCode = request.query.offerCode?.toString();
    const sessionExists = await this.service.sessionExists(
      sessionId,
      offerCode,
    );

    if (!sessionExists) {
      throw new HttpException(
        'Incorrect Session Id',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return true;
  }
}

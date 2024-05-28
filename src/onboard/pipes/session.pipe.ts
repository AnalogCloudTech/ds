import { Injectable, PipeTransform } from '@nestjs/common';
import { OnboardService } from '../onboard.service';
import { SessionDocument } from '../schemas/session.schema';

@Injectable()
export class SessionPipe implements PipeTransform {
  constructor(private readonly service: OnboardService) {}
  async transform(sessionId: string): Promise<SessionDocument> {
    return this.service.findSession(sessionId);
  }
}

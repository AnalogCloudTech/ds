import { PipeTransform } from '@nestjs/common';
import { OnboardService } from '../onboard.service';
import { SessionDocument } from '../schemas/session.schema';
export declare class SessionPipe implements PipeTransform {
    private readonly service;
    constructor(service: OnboardService);
    transform(sessionId: string): Promise<SessionDocument>;
}

import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { OnboardService } from './onboard.service';
import { EmailReminder } from '@/onboard/dto/email-reminder.dto';
export declare class OnboardConsumer {
    readonly service: OnboardService;
    private readonly logger;
    constructor(service: OnboardService, logger: Logger);
    buildPayload(emailReminder: EmailReminder): object;
    sendToES(payload: object): Promise<any>;
    onCompleted(job: Job): Promise<any>;
}

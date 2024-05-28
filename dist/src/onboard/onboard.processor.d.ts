import { Job } from 'bull';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { EmailReminder } from './dto/email-reminder.dto';
import { OnboardService } from '@/onboard/onboard.service';
export declare class OnboardProcessor {
    private readonly sesService;
    constructor(sesService: SesService);
    handleSendMail(job: Job<EmailReminder>): Promise<string>;
}
export declare class CoachingDetailsProcessor {
    private readonly onboardService;
    constructor(onboardService: OnboardService);
    handleJob(job: Job<{
        email: string;
    }>): Promise<boolean>;
}

import { ClientKafka } from '@nestjs/microservices';
import { Logger, OnModuleInit } from '@nestjs/common';
import { EmailsMetricsDto } from '@/integrations/afy-notifications/dto/emails-metrics.dto';
export interface EmailMessage {
    from: string;
    to: string;
    subject: string;
    html: string;
    provider: string;
}
export declare class AfyNotificationsService implements OnModuleInit {
    private readonly clientKafka;
    private readonly logger;
    constructor(clientKafka: ClientKafka, logger: Logger);
    onModuleInit(): Promise<void>;
    sendEmail(emailMessages: EmailMessage[]): Promise<Array<string>>;
    getEmailMetrics(ids: string[], start: string, end: string): Promise<EmailsMetricsDto>;
    checkStatusOf(messageIds: Array<string>, mode?: string): Promise<boolean>;
}

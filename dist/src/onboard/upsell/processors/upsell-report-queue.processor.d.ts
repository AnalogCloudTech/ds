import { S3Service } from '@/internal/libs/aws/s3/s3.service';
import { ConfigService } from '@nestjs/config';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { Job } from 'bull';
import { UpsellCSVJob } from '@/onboard/upsell/types/types';
import { Logger } from '@nestjs/common';
export declare class UpsellReportQueueProcessor {
    private readonly s3Service;
    private readonly configService;
    private readonly sesService;
    private readonly logger;
    constructor(s3Service: S3Service, configService: ConfigService, sesService: SesService, logger: Logger);
    handleJob(job: Job<UpsellCSVJob>): Promise<boolean>;
    onFailed(job: Job, error: Error): void;
}

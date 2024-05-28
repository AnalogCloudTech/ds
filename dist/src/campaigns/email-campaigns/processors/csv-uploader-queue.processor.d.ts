import { Job } from 'bull';
import { S3Service } from '@/internal/libs/aws/s3/s3.service';
import { CSVUploaderJob } from '@/campaigns/email-campaigns/campaigns/domain/types';
import { ConfigService } from '@nestjs/config';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
export declare class CsvUploaderQueueProcessor {
    private readonly s3Service;
    private readonly configService;
    private readonly sesService;
    constructor(s3Service: S3Service, configService: ConfigService, sesService: SesService);
    handleJob(job: Job<CSVUploaderJob>): Promise<void>;
}

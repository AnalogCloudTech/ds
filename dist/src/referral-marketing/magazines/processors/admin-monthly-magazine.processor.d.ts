import { Job } from 'bull';
import { MagazineDocument } from '@/referral-marketing/magazines/schemas/magazine.schema';
import { CmsService } from '@/cms/cms/cms.service';
import { MagazinesService } from '@/referral-marketing/magazines/services/magazines.service';
import { GeneratedMagazinesService } from '@/referral-marketing/magazines/services/generated-magazines.service';
import { Logger } from '@nestjs/common';
export declare class AdminMonthlyMagazineProcessor {
    private readonly cmsService;
    private readonly magazinesService;
    private readonly generatedMagazinesService;
    private readonly logger;
    constructor(cmsService: CmsService, magazinesService: MagazinesService, generatedMagazinesService: GeneratedMagazinesService, logger: Logger);
    handleJob(job: Job<MagazineDocument>): Promise<void>;
    private changeSelectionKeywords;
}

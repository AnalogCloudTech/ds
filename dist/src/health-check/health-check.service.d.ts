import { HealthItem, SystemHealth } from '@/health-check/domain/types';
import { CmsService } from '@/cms/cms/cms.service';
import { ConfigService } from '@nestjs/config';
import { GenerateBookService } from '@/onboard/generate-book/generate-book.service';
import { AnalyticsService } from '@/legacy/dis/legacy/analytics/analytics.service';
export type Methods = 'checkStrapi' | 'checkRedis' | 'checkBba' | 'checkElasticsearch';
export declare class HealthCheckService {
    private readonly configService;
    private readonly cmsService;
    private readonly generateBookService;
    private readonly analyticsService;
    constructor(configService: ConfigService, cmsService: CmsService, generateBookService: GenerateBookService, analyticsService: AnalyticsService);
    selectService(service: Methods): Promise<HealthItem>;
    systemHealth(): Promise<SystemHealth>;
    checkStrapi(): Promise<HealthItem>;
    checkBba(): Promise<HealthItem>;
    checkElasticsearch(): Promise<HealthItem>;
}

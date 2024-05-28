import { HealthCheckService } from './health-check.service';
import { SystemHealth } from '@/health-check/domain/types';
export declare class HealthCheckController {
    private readonly heathCheckService;
    constructor(heathCheckService: HealthCheckService);
    heath(): Promise<SystemHealth>;
    service(service: string): Promise<import("@/health-check/domain/types").HealthItem>;
}

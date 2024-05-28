import { Logger } from '@nestjs/common';
import { CustomerMilestoneService } from './customer-milestone.service';
export declare class CustomerMilestoneScheduler {
    private readonly customersMilestoneService;
    private readonly logger;
    constructor(customersMilestoneService: CustomerMilestoneService, logger: Logger);
    customerMilestone(): Promise<void>;
}

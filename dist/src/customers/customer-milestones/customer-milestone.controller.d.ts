import { Paginator } from '@/internal/utils/paginator';
import { CustomerMilestoneService } from './customer-milestone.service';
export declare class CustomerMilestoneController {
    private readonly customerMilestoneService;
    constructor(customerMilestoneService: CustomerMilestoneService);
    findAll({ page, perPage }: Paginator): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<import("./domain/types").CustomerMilestonesDto>>;
}

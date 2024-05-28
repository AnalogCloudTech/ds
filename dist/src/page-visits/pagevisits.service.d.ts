import { CreatePageVisitsFromPagesteadDto } from './dto/create-pagevisits-from-pagestead.dto';
import { PagevisitsRepository } from './repository/pagevisits.repository';
import { CustomersService } from '@/customers/customers/customers.service';
export declare class PagevisitsService {
    private readonly pagevisitsRepository;
    private readonly customersService;
    constructor(pagevisitsRepository: PagevisitsRepository, customersService: CustomersService);
    createVisits(createPageVisitsDto: CreatePageVisitsFromPagesteadDto): Promise<CreatePageVisitsFromPagesteadDto>;
    private getCustomerDetails;
}

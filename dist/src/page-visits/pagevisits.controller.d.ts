import { PagevisitsService } from './pagevisits.service';
import { CreatePageVisitsFromPagesteadDto } from './dto/create-pagevisits-from-pagestead.dto';
export declare class PagevisitsController {
    private readonly pagevisitsService;
    constructor(pagevisitsService: PagevisitsService);
    createPageVisitsFromPagestead(createPageVisitsFromPagesteadDto: CreatePageVisitsFromPagesteadDto): Promise<CreatePageVisitsFromPagesteadDto>;
}

import { ReferralMarketingService } from './referral-marketing.service';
import { CreateReferralMarketingDto } from './dto/create-referral-marketing.dto';
import { UpdateReferralMarketingDto } from './dto/update-referral-marketing.dto';
import { Paginator, PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { ReferralMarketingDomain } from './domain/referral-marketing-domain';
export declare class ReferralMarketingController {
    private readonly referralMarketingService;
    constructor(referralMarketingService: ReferralMarketingService);
    create(createReferralMarketingDto: CreateReferralMarketingDto): Promise<ReferralMarketingDomain>;
    findAll(status: string, sorting: string, { page, perPage }: Paginator): Promise<PaginatorSchematicsInterface>;
    findOne(id: string): Promise<ReferralMarketingDomain>;
    update(id: string, updateReferralMarketingDto: UpdateReferralMarketingDto): Promise<ReferralMarketingDomain>;
    remove(id: string): Promise<ReferralMarketingDomain>;
}

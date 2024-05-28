import { Paginator, PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { CampaingsService } from './campaings.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
export declare class CampaingsController {
    private readonly campaingsService;
    constructor(campaingsService: CampaingsService);
    create(customer: CustomerDocument, createCampaingDto: CreateCampaignDto): Promise<import("./schemas/campaigns.schema").Campaigns & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
    findAllByCustomerId(customer: CustomerDocument, { page, perPage }: Paginator): Promise<PaginatorSchematicsInterface>;
    findOne(id: string): Promise<import("./schemas/campaigns.schema").CampaignsDocument>;
    update(id: string, updateCampaingDto: UpdateCampaignDto): Promise<import("./schemas/campaigns.schema").CampaignsDocument>;
    remove(id: string): Promise<import("./schemas/campaigns.schema").CampaignsDocument>;
}

import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { CreateAttributesDto } from '@/customers/customers/dto/attributesDto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CampaignAttributesService } from './campaign-attributes.service';
export declare class CampaignAttributesController {
    private readonly attributesService;
    private readonly sesService;
    constructor(attributesService: CampaignAttributesService, sesService: SesService);
    create(createAttributeDto: CreateAttributesDto, customer: CustomerDocument): Promise<void>;
    findOne(customer: CustomerDocument): Promise<import("../../../customers/customers/domain/attributes").Attributes>;
    remove(customer: CustomerDocument): Promise<void>;
    verifyEmail(email: string): Promise<void>;
    emailIsVerified(email: string): Promise<boolean>;
}

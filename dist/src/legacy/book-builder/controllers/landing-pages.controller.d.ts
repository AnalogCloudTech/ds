import { LandingPagesService } from '../services/landing-pages.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { LandingPageProfile } from '@/customers/customers/domain/landing-page-profile';
import { UpdateLandingPageProfileDto } from '@/customers/customers/dto/update-landing-page-profile.dto';
import { CreateCustomUrlDto } from '../dto/create-custom-url.dto';
export declare class LandingPagesController {
    private readonly service;
    constructor(service: LandingPagesService);
    getLandingPageProfile(customer: CustomerDocument): LandingPageProfile;
    saveLandingPageProfile(customer: CustomerDocument, dto: UpdateLandingPageProfileDto): Promise<LandingPageProfile>;
    getLandingPageDetailsByEmail(email: string): Promise<LandingPageProfile>;
    getCustomLandingPageByEmail(email: string): Promise<import("../schemas/custom-landing-page.schema").CustomLandingPageDocument>;
    createCustomLandingPage(dto: CreateCustomUrlDto): Promise<import("../schemas/custom-landing-page.schema").CustomLandingPageDocument>;
    updateCustomLandingPageUrl(id: string, body: Partial<CreateCustomUrlDto>): Promise<import("../schemas/custom-landing-page.schema").CustomLandingPageDocument>;
    deleteCustomlandingPageUrl(id: string): Promise<import("../schemas/custom-landing-page.schema").CustomLandingPageDocument>;
}

/// <reference types="mongoose" />
import { CustomersService } from '@/customers/customers/customers.service';
import { CustomerId } from '@/customers/customers/domain/types';
import { UpdateLandingPageProfileDto } from '@/customers/customers/dto/update-landing-page-profile.dto';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { LandingPagesRepository } from '../repositories/landing-pages.repository';
import { CreateCustomUrlDto } from '../dto/create-custom-url.dto';
export declare class LandingPagesService {
    private readonly landingPagesRepository;
    private readonly service;
    private readonly hubspotService;
    constructor(landingPagesRepository: LandingPagesRepository, service: CustomersService, hubspotService: HubspotService);
    saveProfile(id: CustomerId, dto: UpdateLandingPageProfileDto): Promise<import("mongoose").Document<unknown, any, import("../../../customers/customers/schemas/customer.schema").Customer> & import("../../../customers/customers/schemas/customer.schema").Customer & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getLandingPageDetailsByEmail(email: string): Promise<any[]>;
    findDetailsByEmail(email: string): Promise<import("../schemas/custom-landing-page.schema").CustomLandingPageDocument>;
    createCustomLandingPage(dto: CreateCustomUrlDto): Promise<import("../schemas/custom-landing-page.schema").CustomLandingPageDocument>;
    updateCustomLandingPage(id: string, dto: Partial<CreateCustomUrlDto>): Promise<import("../schemas/custom-landing-page.schema").CustomLandingPageDocument>;
    deleteCustomLandingPage(id: string): Promise<import("../schemas/custom-landing-page.schema").CustomLandingPageDocument>;
}

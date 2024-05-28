import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { Queue } from 'bull';
import { Model } from 'mongoose';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaigns, CampaignsDocument } from './schemas/campaigns.schema';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CmsService } from '@/cms/cms/cms.service';
import { Attribute, AttributesDocument } from '../attributes/schemas/attributes.schemas';
import { CommonHelpers } from './helpers/common.helpers';
import { Axios } from 'axios';
import { ConfigService } from '@nestjs/config';
export declare class CampaingsService {
    private readonly campaignModel;
    private readonly attributeModel;
    private readonly queue;
    private cmsSerivces;
    private commonHelper;
    private readonly configService;
    private readonly http;
    constructor(campaignModel: Model<CampaignsDocument>, attributeModel: Model<AttributesDocument>, queue: Queue, cmsSerivces: CmsService, commonHelper: CommonHelpers, configService: ConfigService, http: Axios);
    create(customer: CustomerDocument, createCampaingDto: CreateCampaignDto): Promise<Campaigns & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
    findAll(page: number, perPage: number): Promise<PaginatorSchematicsInterface>;
    findOne(id: string): Promise<CampaignsDocument>;
    findAllByCustomerId(customer: CustomerDocument, page: number, perPage: number): Promise<PaginatorSchematicsInterface>;
    update(id: string, updateCampaingDto: UpdateCampaignDto): Promise<CampaignsDocument>;
    remove(id: string): Promise<CampaignsDocument>;
    getSMCampaigns(): Promise<(Campaigns & import("mongoose").Document<any, any, any> & {
        _id: any;
    })[]>;
    addSMCampaignsIntoQueue(campaigns: CampaignsDocument[]): Promise<import("bull").Job<any>>;
    addSMAttributesIntoQueue(attributes: AttributesDocument[]): Promise<import("bull").Job<any>>;
    getSMCampaignsToSend(): Promise<(Campaigns & import("mongoose").Document<any, any, any> & {
        _id: any;
    })[]>;
    getSMAttributes(socialMedia: any): import("mongoose").Query<(Attribute & import("mongoose").Document<any, any, any> & {
        _id: any;
    })[], Attribute & import("mongoose").Document<any, any, any> & {
        _id: any;
    }, {}, AttributesDocument>;
    updateFBToken(attributes: any): Promise<void>;
}

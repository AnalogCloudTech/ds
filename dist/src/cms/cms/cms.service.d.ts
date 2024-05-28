import { Axios } from 'axios';
import { DataObject, QueryParams } from './types/common';
import { CreateTemplate, Template, TemplateDetails } from './types/template';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { ReferralMarketingMagazine } from './types/referral-marketing-magazine';
import { ChargifyUpgradePathDto, ChargifyUpgradePathResponseDto } from '@/onboard/dto/chargify-upgrade-path.dto';
import { ConfigService } from '@nestjs/config';
import { Content } from '@/cms/cms/types/content';
import { ProductPackages } from '@/legacy/dis/legacy/payments/types';
export declare class CmsService {
    private readonly http;
    private readonly configService;
    constructor(http: Axios, configService: ConfigService);
    passthruGet(url: string): Promise<import("axios").AxiosResponse<any, any>>;
    templateListWithPagination<T = any>(query?: QueryParams | string): Promise<PaginatorSchematicsInterface>;
    templateListDropdown(): Promise<Template[]>;
    templateDetails(id: number, queryString?: QueryParams | string): Promise<TemplateDetails>;
    socialTemplatesList(queryString?: QueryParams | string): Promise<PaginatorSchematicsInterface>;
    socialMediaTemplateDetails(id: number, queryString?: QueryParams | string): Promise<{
        imageUrl: any;
        socialMedia: any;
        name: string;
        content: string;
        createdAt: string;
        subject: string;
        customerId?: string;
        bodyContent: string;
        templateTitle: string;
    }>;
    socialMediaMultipleTemplateDetails(templateArray: Array<number>, queryString?: QueryParams | string): Promise<any[]>;
    segmentsList(queryString: string): Promise<{
        id: any;
        name: any;
    }[]>;
    contentsList(queryString?: string): Promise<{
        id: any;
        name: any;
        image: any;
        numberOfEmails: any;
    }[]>;
    socialMediaContentsList(queryString?: QueryParams | string): Promise<PaginatorSchematicsInterface<any>>;
    socialMediaContentsDetails(contentId: number): Promise<{
        id: number;
        name: any;
        image: any;
        campaignPost: {
            id: any;
            name: any;
            relativeDays: any;
            absoluteDay: any;
            absoluteMonth: any;
            content: any;
            templateName: any;
            image: any;
            socialMedia: any;
        }[];
    }>;
    productPackages(queryString?: string): Promise<ProductPackages[]>;
    magazineData({ month, year }: {
        month: string;
        year: string;
    }): Promise<[] | DataObject<ReferralMarketingMagazine>[]>;
    contentDetailsRaw(contentId: number): Promise<DataObject<Content>>;
    socialMediaContentDetailsRaw(contentId: number): Promise<DataObject<any>>;
    contentDetails(contentId: number): Promise<{
        id: number;
        name: string;
        image: any;
        emails: {
            id: number;
            name: string;
            usesRelativeTime: boolean;
            relativeDays: number;
            absoluteDay: number;
            absoluteMonth: number;
            templateName: string;
            image: any;
        }[];
    }>;
    allSegmentsExists(ids: number[]): Promise<void>;
    createTemplate(customer: CustomerDocument, templateData: CreateTemplate): Promise<DataObject<Template>>;
    updateTemplate(templateId: any, templateData: Template): Promise<DataObject<Template>>;
    deleteTemplate(templateId: any): Promise<{
        id: any;
    }>;
    magazineDetails(magazineId: number, route?: string): Promise<DataObject<ReferralMarketingMagazine>>;
    healthCheck(): Promise<import("axios").AxiosResponse<any, any>>;
    private generalDetails;
    private generalCreate;
    private generalUpdate;
    private generalDelete;
    private generalList;
    generalListWithPagination<T = any>(route: string, query?: QueryParams | string): Promise<PaginatorSchematicsInterface>;
    private validateQueryString;
    getUpgradePath(dto: ChargifyUpgradePathDto): Promise<ChargifyUpgradePathResponseDto>;
    getPlans(ChargifyProductListId: number, bookId: string): Promise<ChargifyUpgradePathResponseDto>;
    getSocialMediaTrainingConfig(): Promise<string[]>;
    getUpgradeNowTermsConfig(): Promise<string>;
    getReferralMarketingPlans(): Promise<string[]>;
}

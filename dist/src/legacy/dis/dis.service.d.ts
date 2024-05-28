import { CreateCustomerDto } from '@/customers/customers/dto/create-customer.dto';
import { Logger } from '@nestjs/common';
import { Webinar } from './domain/webinar';
import { Axios } from 'axios';
import { ConfigService } from '@nestjs/config';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
export declare class DisService {
    private readonly http;
    private readonly configService;
    private readonly hubspotService;
    private readonly logger;
    constructor(http: Axios, configService: ConfigService, hubspotService: HubspotService, logger: Logger);
    getAutoLoginToken(id: string): Promise<string | false>;
    authenticateCustomerThroughHubspot(email: string, password: string): Promise<boolean>;
    syncDependencies(dto: CreateCustomerDto, loginToken?: string, passwordEncrypted?: string): Promise<{
        hubspotId: string;
    }>;
    private fixCountry;
    private validateAddress;
    private syncHubspot;
    getWebinarInfo(webinarCode: string): Promise<Webinar>;
    webinarRegistration(webinarCode: string, start: string, name: string, email: string, smsNumber: string): Promise<void>;
    addCustomerToWorkFlow(contactEmail: any, workFlowId: any): Promise<void>;
}

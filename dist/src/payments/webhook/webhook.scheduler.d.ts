import { Logger } from '@nestjs/common';
import { CustomerPropertiesService } from '@/customers/customer-properties/customer-properties.service';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
export declare class WebhookScheduler {
    private logger;
    private customerPropertiesService;
    private hubspotService;
    constructor(logger: Logger, customerPropertiesService: CustomerPropertiesService, hubspotService: HubspotService);
    handleMissingAssociation(): Promise<void>;
}

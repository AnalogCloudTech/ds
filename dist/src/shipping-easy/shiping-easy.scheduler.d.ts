import { Logger } from '@nestjs/common';
import { CustomerPropertiesService } from '@/customers/customer-properties/customer-properties.service';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { ShippingEasyService } from './shipping-easy.service';
import { CustomersService } from '@/customers/customers/customers.service';
export declare class ShippingEasyScheduler {
    private shippingEasyService;
    private customerPropertiesService;
    private hubspotService;
    private customersService;
    private logger;
    constructor(shippingEasyService: ShippingEasyService, customerPropertiesService: CustomerPropertiesService, hubspotService: HubspotService, customersService: CustomersService, logger: Logger);
    handleShippingEasyScheduler(): Promise<void>;
    private getShippingEasyOrder;
}

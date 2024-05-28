import { PipeTransform } from '@nestjs/common';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
export declare class IsAdmin implements PipeTransform {
    private readonly request;
    private readonly hubspotService;
    constructor(request: any, hubspotService: HubspotService);
    transform(): Promise<boolean>;
}

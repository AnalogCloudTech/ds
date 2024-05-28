import { PipeTransform } from '@nestjs/common';
import { OnDemandEmailsService } from '@/campaigns/email-campaigns/on-demand-emails/on-demand-emails.service';
export declare class CanBeChangedPipe implements PipeTransform {
    private readonly service;
    constructor(service: OnDemandEmailsService);
    transform(onDemandEmailId: string): Promise<string>;
}

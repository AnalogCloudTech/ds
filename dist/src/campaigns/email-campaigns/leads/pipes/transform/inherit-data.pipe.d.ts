import { PipeTransform } from '@nestjs/common';
import { LeadsService } from '@/campaigns/email-campaigns/leads/leads.service';
import { CreateLeadDto } from '@/campaigns/email-campaigns/leads/dto/create-lead.dto';
import { CreateLeadFromPagesteadDto } from '@/campaigns/email-campaigns/leads/dto/create-lead-from-pagestead.dto';
export declare class InheritDataPipe implements PipeTransform {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    transform(dto: CreateLeadDto | CreateLeadFromPagesteadDto): Promise<CreateLeadDto | CreateLeadFromPagesteadDto>;
}

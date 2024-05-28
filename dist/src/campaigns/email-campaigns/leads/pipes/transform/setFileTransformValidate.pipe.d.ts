import { PipeTransform } from '@nestjs/common';
import { ImportLeadDto } from '@/campaigns/email-campaigns/leads/dto/import-lead.dto';
export declare class SetFileTransformValidatePipe implements PipeTransform {
    private readonly request;
    constructor(request: any);
    transform(dto: ImportLeadDto): ImportLeadDto;
}

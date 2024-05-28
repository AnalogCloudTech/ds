import { PipeTransform } from '@nestjs/common';
import { CreateLeadFromPagesteadDto } from '@/campaigns/email-campaigns/leads/dto/create-lead-from-pagestead.dto';
import { CmsService } from '@/cms/cms/cms.service';
export declare class PopulateSegmentsFromBookIdPipeTransform implements PipeTransform {
    private readonly cmsService;
    constructor(cmsService: CmsService);
    transform(dto: CreateLeadFromPagesteadDto): Promise<CreateLeadFromPagesteadDto>;
    private populateSegments;
}

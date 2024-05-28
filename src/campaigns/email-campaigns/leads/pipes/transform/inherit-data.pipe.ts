import { Inject, PipeTransform } from '@nestjs/common';
import { LeadsService } from '@/campaigns/email-campaigns/leads/leads.service';
import { CreateLeadDto } from '@/campaigns/email-campaigns/leads/dto/create-lead.dto';
import { CreateLeadFromPagesteadDto } from '@/campaigns/email-campaigns/leads/dto/create-lead-from-pagestead.dto';

export class InheritDataPipe implements PipeTransform {
  constructor(
    @Inject(LeadsService) private readonly leadsService: LeadsService,
  ) {}

  async transform(
    dto: CreateLeadDto | CreateLeadFromPagesteadDto,
  ): Promise<CreateLeadDto | CreateLeadFromPagesteadDto> {
    const dtoData = await this.leadsService.fillWithInheritanceData(
      dto.email,
      dto,
    );

    return dtoData;
  }
}

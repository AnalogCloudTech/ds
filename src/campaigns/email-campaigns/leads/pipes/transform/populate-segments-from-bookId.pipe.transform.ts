import { Inject, PipeTransform } from '@nestjs/common';
import { CreateLeadFromPagesteadDto } from '@/campaigns/email-campaigns/leads/dto/create-lead-from-pagestead.dto';
import { CmsService } from '@/cms/cms/cms.service';
import {
  CmsFilterBuilder,
  CmsFilterObject,
} from '@/internal/utils/cms/filters/cms.filter.builder';

export class PopulateSegmentsFromBookIdPipeTransform implements PipeTransform {
  constructor(@Inject(CmsService) private readonly cmsService: CmsService) {}

  async transform(
    dto: CreateLeadFromPagesteadDto,
  ): Promise<CreateLeadFromPagesteadDto> {
    if (dto.bookId) {
      await this.populateSegments(dto.bookId, dto);
    }

    return dto;
  }

  private async populateSegments(
    bookId,
    dto: CreateLeadFromPagesteadDto,
  ): Promise<void> {
    const cmsFilterObjects: CmsFilterObject[] = [];
    cmsFilterObjects.push(<CmsFilterObject>{
      name: 'bookId',
      operator: '$eq',
      value: bookId,
    });

    const queryString = `?${CmsFilterBuilder.build(cmsFilterObjects)}`;
    const segments = await this.cmsService.segmentsList(queryString);
    dto.segments = segments.map((item) => item.id);
  }
}

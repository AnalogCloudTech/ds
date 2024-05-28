import { Controller, Get, Param, Query } from '@nestjs/common';
import { ContentsService } from '@/campaigns/social-media/contents/contents.service';
import { Paginator } from '@/internal/utils/paginator';
import { QueryParams } from '@/cms/cms/types/common';

@Controller({ path: 'social-media/contents', version: '1' })
export class ContentsController {
  constructor(private readonly contentsServiceService: ContentsService) {}

  @Get(':id')
  public show(@Param('id') contentId: number) {
    return this.contentsServiceService.details(contentId);
  }

  @Get()
  public list(@Query() { page, perPage: pageSize }: Paginator) {
    const query: QueryParams = {
      pagination: {
        page,
        pageSize,
      },
    };
    return this.contentsServiceService.list(query);
  }
}

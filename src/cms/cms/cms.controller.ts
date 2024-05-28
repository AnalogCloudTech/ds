import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { CmsService } from '@/cms/cms/cms.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const qs = require('qs');

@Controller({ path: 'cms', version: '1' })
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('*')
  public async passthruGet(
    @Request() req,
    @Param() routeObject: any,
    @Query() params: string,
  ) {
    const route = routeObject[0] ?? '';
    const stringifiedParams = qs.stringify(params);
    const url = `/${route}?${stringifiedParams}`;
    const response = await this.cmsService.passthruGet(url);
    return response?.data;
  }
}

import { All, Body, Controller, Param, Query, Req } from '@nestjs/common';
import { ChargifyService } from './chargify.service';
import { generateUrl } from '@/internal/utils/url';
import { Request } from 'express';
import { Method } from '@/internal/utils/request';

@Controller({ path: 'chargify', version: '1' })
export class ChargifyController {
  constructor(private readonly chargifyService: ChargifyService) {}

  @All('*')
  public async passthruGet(
    @Req() req: Request,
    @Param() routeObject: { [key: string]: string },
    @Query() params: { [key: string]: any },
    @Body() body: { [key: string]: any },
  ) {
    const reqMethod = <Method>req.method.toLowerCase();
    const url = generateUrl(routeObject, params);
    return this.chargifyService.passthru(url, reqMethod, body);
  }
}

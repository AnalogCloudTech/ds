import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { WebinarsService } from './webinars.service';
import { RegisterWebinarDto } from './dto/registerWebinar.dto';

@Controller({ path: 'webinars', version: '1' })
export class WebinarsController {
  constructor(
    private readonly webinarsService: WebinarsService,
    @Inject('SHOULD_MOCK_WEBINAR_API')
    private readonly shouldMockWebinarApi: boolean,
  ) {}

  @Get(':webinarCode')
  findOne(@Param('webinarCode') webinarCode: string) {
    return this.webinarsService.getWebinar(webinarCode);
  }

  @Post(':webinarCode')
  register(
    @Param('webinarCode') webinarCode: string,
    @Body() registerWebinar: RegisterWebinarDto,
  ) {
    if (this.shouldMockWebinarApi) {
      return 'Successfully Registered';
    } else {
      return this.webinarsService.registerWebinar(webinarCode, registerWebinar);
    }
  }
}

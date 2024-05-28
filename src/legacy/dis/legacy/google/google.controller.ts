import { Controller, Get } from '@nestjs/common';
import { GoogleService } from './google.service';

// TO-DO: remove this controller later
@Controller({ path: 'calendar', version: '1' })
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('events')
  getBusySlots() {
    return 'this endpoint is deprecated please use the Calendar module, refer to api documentation for more info';
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';

export class CampaignWithoutAvailableLeadsException extends HttpException {
  constructor(
    public defaultResponseMessage = 'Campaign without available leads',
  ) {
    super(defaultResponseMessage, HttpStatus.FAILED_DEPENDENCY);
  }
}

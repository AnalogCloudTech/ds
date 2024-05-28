import { HttpException, HttpStatus } from '@nestjs/common';

export class CampaignWithoutAvailableEmailsException extends HttpException {
  constructor(
    public defaultResponseMessage = 'Campaign without available emails',
  ) {
    super(defaultResponseMessage, HttpStatus.FAILED_DEPENDENCY);
  }
}

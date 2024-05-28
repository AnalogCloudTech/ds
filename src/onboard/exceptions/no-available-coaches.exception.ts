import { HttpException, HttpStatus } from '@nestjs/common';

export class NoAvailableCoachesException extends HttpException {
  constructor() {
    super(
      'Could not find a coach for the session',
      HttpStatus.FAILED_DEPENDENCY,
    );
  }
}

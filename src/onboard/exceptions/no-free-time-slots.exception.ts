import { HttpException, HttpStatus } from '@nestjs/common';

export class NoFreeTimeSlotsException extends HttpException {
  constructor() {
    super('No free time slots', HttpStatus.FAILED_DEPENDENCY);
  }
}

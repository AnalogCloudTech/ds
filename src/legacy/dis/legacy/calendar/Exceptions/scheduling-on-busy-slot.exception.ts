import { HttpException, HttpStatus } from '@nestjs/common';

export class SchedulingOnBusySlotException extends HttpException {
  constructor(
    public defaultResponseMessage = 'Selected time slot is not available',
  ) {
    super(defaultResponseMessage, HttpStatus.BAD_REQUEST);
  }
}

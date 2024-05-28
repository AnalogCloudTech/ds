import { HttpException, HttpStatus } from '@nestjs/common';

export class MaxPerPageException extends HttpException {
  constructor() {
    super('Max items per page should be 50 or less', HttpStatus.BAD_REQUEST);
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomerPropertyNotFoundException extends HttpException {
  constructor(public defaultResponseMessage = 'Customer Property Not found') {
    super(defaultResponseMessage, HttpStatus.NOT_FOUND);
  }
}

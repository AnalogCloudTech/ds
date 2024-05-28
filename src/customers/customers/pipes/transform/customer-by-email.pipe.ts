import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { CustomersService } from '@/customers/customers/customers.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';

@Injectable({ scope: Scope.REQUEST })
export class CustomerByEmailPipe implements PipeTransform {
  constructor(
    private readonly service: CustomersService,
    @Inject(REQUEST) private readonly request,
  ) {}

  async transform(): Promise<CustomerDocument> {
    const user = this.request.user;
    const email = <string>user.email;
    const customer = await this.service.findByEmail(email);

    if (!customer) {
      throw new HttpException(
        { message: 'Customer not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return customer;
  }
}

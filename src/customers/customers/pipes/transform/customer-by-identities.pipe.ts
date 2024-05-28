import {
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { CustomersService } from '@/customers/customers/customers.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CreateCustomerDto } from '@/customers/customers/dto/create-customer.dto';

@Injectable({ scope: Scope.REQUEST })
export class CustomerPipeByIdentities implements PipeTransform {
  constructor(
    private readonly service: CustomersService,
    @Inject(REQUEST) private readonly request,
  ) {}

  async transform(): Promise<CustomerDocument> {
    const origin = this.request.user ? 'jwt' : 'afy-api-key';

    const user = this.request.user ?? this.request.body.user;
    const email = <string>user.email;
    const identities = <Array<string>>(user.identities ?? [user.email]);

    let customer = await this.service.findByIdentities(identities);
    if (!customer) {
      if (origin === 'afy-api-key') {
        throw new NotFoundException('Customer not found');
      }

      const dto: CreateCustomerDto = {
        email,
        firstName: user.firstname,
        lastName: user.lastname,
        phone: user.mobilephone,
        password: '',
        billing: {
          state: user.state,
          country: user.country,
          zip: user.zip,
          city: user.city,
          address1: '',
        },
        attributes: null,
        chargifyToken: '',
        smsPreferences: {
          schedulingCoachReminders: false,
        },
      };
      customer = await this.service.create(dto);
    }
    return customer;
  }
}

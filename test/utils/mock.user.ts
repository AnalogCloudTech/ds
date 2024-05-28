import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { CustomersService } from '@/customers/customers/customers.service';

@Injectable()
export class MockCustomerPipe implements PipeTransform {
  constructor(
    @Inject(CustomersService)
    private readonly service: CustomersService,
  ) {}

  async transform() {
    let customer = await this.service.findByEmail('janedoe@authorify.com');
    if (!customer) {
      customer = await this.service.create({
        email: 'janedoe@authorify.com',
        firstName: 'jane',
        lastName: 'doe',
        phone: '5599999999',
        password: 'testeteste2',
        billing: {
          state: '',
          country: 'BR',
          zip: '849999999',
          city: 'test',
          address1: '',
        },
        attributes: null,
      });
    }

    return customer;
  }
}

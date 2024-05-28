import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Injectable } from '@nestjs/common';
import { CreatePageVisitsFromPagesteadDto } from './dto/create-pagevisits-from-pagestead.dto';
import { PagevisitsRepository } from './repository/pagevisits.repository';
import { CustomersService } from '@/customers/customers/customers.service';
@Injectable()
export class PagevisitsService {
  constructor(
    private readonly pagevisitsRepository: PagevisitsRepository,
    private readonly customersService: CustomersService,
  ) {}

  async createVisits(
    createPageVisitsDto: CreatePageVisitsFromPagesteadDto,
  ): Promise<CreatePageVisitsFromPagesteadDto> {
    const data = {
      ...createPageVisitsDto,
    };

    const customer = await this.getCustomerDetails(
      createPageVisitsDto.customerEmail,
    );

    if (customer) {
      data['customer'] = customer;
    }
    return this.pagevisitsRepository.store<CreatePageVisitsFromPagesteadDto>(
      data,
    );
  }

  private getCustomerDetails(customerEmail: string): Promise<CustomerDocument> {
    return this.customersService.findByIdentities([customerEmail]);
  }
}

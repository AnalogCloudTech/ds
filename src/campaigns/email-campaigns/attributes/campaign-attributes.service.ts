import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { CustomersService } from '@/customers/customers/customers.service';
import { Attributes } from '@/customers/customers/domain/attributes';
import { Customer } from '@/customers/customers/domain/customer';
import { CustomerId } from '@/customers/customers/domain/types';
import { CreateAttributesDto } from '@/customers/customers/dto/attributesDto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CampaignAttributesService {
  constructor(
    private readonly customerService: CustomersService,
    private readonly sesService: SesService,
  ) {}

  async create(id, createAttributeDto: CreateAttributesDto) {
    const emailIsVerified = await this.sesService.emailIsVerified(
      createAttributeDto.email,
    );

    if (!emailIsVerified) {
      await this.sesService.sendVerificationEmail(createAttributeDto.email);
    }

    return this.customerService.saveCampaignAttributes(id, createAttributeDto);
  }

  async findOne(id: CustomerId): Promise<Attributes> {
    const customer = (await this.customerService.findById(id)).castTo(Customer);
    return customer?.attributes;
  }

  remove(id: CustomerId) {
    return this.customerService.saveCampaignAttributes(id, null);
  }
}

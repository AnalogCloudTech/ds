import { IsAdminGuard } from '@/internal/common/guards/is-admin.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { CustomersService } from '../customers.service';
import { Customer } from '../domain/customer';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { EmailLowerCasePipe } from '@/internal/common/pipes/email-lower-case.pipe';
import { UpdateCustomerFlippingBookPreferences } from '@/customers/customers/dto/update-customer.dto';
import { ApiKeyOnly, Public } from '@/auth/auth.service';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import {
  CustomerDocument,
  LandingPageWebsite,
} from '@/customers/customers/schemas/customer.schema';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { UpdateAvatarDto } from '@/customers/customers/dto/update-avatar.dto';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { FindCustomerByNameOrEmailDto } from '@/customers/customers/dto/find-customer-by-name-or-email.dto';
import { Paginator, PaginatorTransformPipe } from '@/internal/utils/paginator';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import { SchemaId } from '@/internal/types/helpers';

@Controller({ path: 'customers', version: '1' })
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly hubspotService: HubspotService,
  ) {}

  @UseGuards(IsAdminGuard)
  @Get('find-all')
  async getAllCustomers(
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
  ) {
    return this.customersService.getAllCustomers(page, perPage);
  }

  @Get('')
  getCustomer(@Param(CustomerPipeByIdentities) customer: CustomerDocument) {
    return customer;
  }

  @Post('/')
  async register(
    @Body(EmailLowerCasePipe) registerCustomer: CreateCustomerDto,
  ): Promise<Customer> {
    const result = await this.customersService.create(registerCustomer);
    return result.castTo(Customer);
  }

  @Patch('')
  @Serialize(Customer)
  update(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Body(ValidationPipe) updateProperties: Partial<CustomerDocument>,
  ) {
    return this.customersService.update(customer, updateProperties);
  }

  // TODO: This route shouldn't be public, but it's not possible to use on
  // customer login at Onboard point
  @Public()
  @Patch('avatar')
  async publicUpdateAvatar(
    @Body(ValidationPipe) { email, avatar }: UpdateAvatarDto,
  ) {
    const update = await this.customersService.publicUpdate(email, avatar);

    await this.hubspotService.createOrUpdateContact({
      email,
      afy_customer_profile_image_url: avatar,
    });

    return { status: !!update };
  }

  @ApiKeyOnly()
  @Patch('/flippingbookpreferences/update/:id')
  async updateFlippingBookPreferences(
    @Param('id') id: SchemaId,
    @Body() flippingBookPreferences: UpdateCustomerFlippingBookPreferences,
  ): Promise<void> {
    await this.customersService.updateFlippingBookPreferences(
      id,
      flippingBookPreferences,
    );
  }

  @Serialize(Customer)
  @Get('list-customers-by-name-or-email')
  async findCustomerByTerm(
    @Query(ValidationPipe) dto: FindCustomerByNameOrEmailDto,
  ) {
    return await this.customersService.listByNameOrEmail(dto.nameOrEmail);
  }

  @Serialize(Customer)
  @Post('add-landing-page-website')
  async addLandingPageWebsite(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Body(ValidationPipe) body: LandingPageWebsite,
  ) {
    return this.customersService.addLandingPageWebsite(customer._id, body);
  }

  @Get('get-landing-page-website/:id')
  async getLandingPageWebsite(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Param('id') id: string,
  ) {
    return this.customersService.getLandingPageWebsite(customer.email, id);
  }

  @ApiKeyOnly()
  @Get('find/filter')
  async find(
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
    @Query('query') query: string,
  ) {
    return this.customersService.findCustomerByQuery({ query, page, perPage });
  }
}

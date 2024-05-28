import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { Stripe as StripeLib } from 'stripe';
import { Request } from 'express';
import { get } from 'lodash';
import {
  CreateSubscriptionDto,
  SubscriptionProrationDto,
  UpgradeSubscriptionDto,
} from './dto/subscription.dto';
import { Customer } from './dto/customer.dto';
import { PaymentsService } from './payments.service';
import {
  PaymentPlansQueryFilters,
  ProductPackages,
} from '@/legacy/dis/legacy/payments/types';

@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('subscription')
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.paymentsService.createSubscription(createSubscriptionDto);
  }

  @Patch('subscription/upgrade')
  async upgradeSubscription(
    @Body(ValidationPipe) upgradeSubscriptionDto: UpgradeSubscriptionDto,
  ) {
    return this.paymentsService.upgradeSubscription(upgradeSubscriptionDto);
  }

  @Post('subscription/proration')
  async getProration(
    @Body(ValidationPipe) subscriptionProrationDto: SubscriptionProrationDto,
    @Req() request: Request,
  ) {
    const email = <string>get(request, ['user', 'email']);
    return this.paymentsService.getProration(email, subscriptionProrationDto);
  }

  @Post('customer')
  async createOrUpdateCustomer(@Body() customer: Customer) {
    return this.paymentsService.createOrUpdateCustomer(customer);
  }

  @Get('customer/search')
  async findCustomerByEmail(@Query('email') email: string) {
    return this.paymentsService.findCustomerByEmail(email);
  }

  @Get('customer/payment-methods')
  async getPaymentMethods(@Req() request: Request) {
    const email = <string>get(request, ['user', 'email']);
    return this.paymentsService.getPaymentMethods(email);
  }

  @Get('customer/payments')
  async getPayments(@Req() request: Request) {
    const email = <string>get(request, ['user', 'email']);
    return this.paymentsService.getInvoices(email);
  }

  @Get('customer/subscription')
  async getSubscriptionByCustomer(
    @Req() request: Request,
    @Query('active') active: string | boolean,
  ) {
    const email = <string>get(request, ['user', 'email']);
    const filterActive = active === 'true' || active === true;

    return this.paymentsService.getSubscriptionByCustomer(email, filterActive);
  }
  
  @Get('customer/:id')
  getCustomer(@Param('id') id: string): Promise<StripeLib.Customer> {
    return this.paymentsService.getCustomer(id);
  }

  @Patch('customer/:id')
  updateCustomer(
    @Body() customer: Customer,
    @Param('id') id: string,
  ): Promise<StripeLib.Customer> {
    return this.paymentsService.updateCustomer(id, customer);
  }

  @Get('product-plans')
  async productPackages(
    @Query('filters') filters: PaymentPlansQueryFilters,
    @Req() request: Request,
  ): Promise<ProductPackages[]> {
    const plusPlan = get(filters, 'plusPlan') as string;
    const email = get(request, ['user', 'email']) as string;
    return this.paymentsService.getPlans(email, plusPlan);
  }
}

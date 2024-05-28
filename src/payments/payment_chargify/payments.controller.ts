import {
  All,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { PaymentChargifyService } from './payments.service';
import { Request } from 'express';
import { get, isEmpty, isNull } from 'lodash';

import { paramsStringify } from '@/internal/utils/url';
import {
  CreateSubscriptionDto,
  PurgeQuery,
  UpdateSubscriptionDto,
} from './dto/subscription.dto';
import { CreateInvoiceDto, VoidInvoiceDto } from './dto/invoice.dto';
import { createPaymentDto } from './dto/payment.dto';
import { createPaymentProfileDto } from './dto/paymentProfile.dto';
import { subscriptionFilters } from './payments.constants';
import {
  AllocateComponentDto,
  CreatePreviewAllocationDto,
} from './dto/components.dto';
import {
  CreditCard,
  Invoice,
  PaymentProfile,
  PaymentProfiles,
} from '../chargify/domain/types';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { PaymentsWebsocketGateway } from '@/payments/payment_chargify/gateways/payments.gateway';
import { ApiKeyOnly } from '@/auth/auth.service';
import { PaymentStatusDto } from '@/payments/payment_chargify/dto/payment-status.dto';
import DateRangeDTO from '@/internal/common/dtos/date-range.dto';
import {
  Paginator,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import { AccountType } from '@/customers/customers/domain/types';

@Controller({ path: 'payment-chargify', version: '1' })
export class PaymentChargifyController {
  constructor(
    private readonly paymentChargifyService: PaymentChargifyService,
    private readonly paymentsWebsocketGateway: PaymentsWebsocketGateway,
  ) {}

  @Get('/payment-profiles')
  public async getPaymentProfilesFromEmail(
    @Req() request: Request,
    @Body() body?: { user: { email: string } },
  ): Promise<PaymentProfiles[]> {
    const email = (get(request, ['user', 'email']) ??
      get(body, ['user', 'email'])) as string;

    if (isEmpty(email) || isNull(email)) {
      throw new NotFoundException('Customer Not Found');
    }

    return this.paymentChargifyService.getPaymentProfilesFromEmail(email);
  }

  @All('/payment-profiles-list')
  public async getPaymentProfilesListFromEmail(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ): Promise<PaymentProfile[]> {
    const { email } = customer;
    return this.paymentChargifyService.getPaymentProfilesListFromEmail(email);
  }

  @Get('/get-show-credits-button')
  public async getShowCreditsButton(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ): Promise<boolean> {
    const { email, accountType } = customer;
    if (accountType === AccountType.DENTIST) {
      return true;
    }
    return this.paymentChargifyService.getShowCreditsButton(email);
  }

  @Get('/get-billing-history')
  async getMemberActiveList(
    @Query() { page, perPage }: Paginator,
    @Query() { startDate, endDate }: DateRangeDTO,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ): Promise<PaginatorSchematicsInterface<Invoice> | []> {
    return this.paymentChargifyService.getBillingHistory(
      customer,
      startDate,
      endDate,
      Number(page),
      Number(perPage),
    );
  }

  @Get('/subscriptions')
  public async getSubscriptionsFromEmail(
    @Req() request: Request,
    @Query('active') active = 'false',
  ) {
    const email = get(request, ['user', 'email']) as string;
    const filterActive = subscriptionFilters[
      active
    ] as keyof typeof subscriptionFilters;
    return this.paymentChargifyService.getSubscriptionsFromEmail(
      email,
      filterActive,
    );
  }

  @Get('/default-payment-profiles')
  async getDefaultPaymentProfile(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ): Promise<CreditCard> {
    const { email } = customer;
    return await this.paymentChargifyService.getDefaultPaymentProfile(email);
  }

  @Post('/payment-profiles/:id')
  public async changeDefaultPaymentProfile(
    @Req() request: Request,
    @Param('id') paymentProfileId: string,
  ): Promise<Array<PaymentProfiles>> {
    const email = get(request, ['user', 'email']) as string;
    return await this.paymentChargifyService.changeDefaultPaymentProfile(
      email,
      paymentProfileId,
    );
  }

  @Delete('/payment-profile/:id')
  async deletePaymentProfile(
    @Param('id') profileId: string,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ): Promise<{ message: string }> {
    const { email } = customer;
    return this.paymentChargifyService.deletePaymentProfile(profileId, email);
  }

  @Put('/payment-profile/:id')
  async updatePaymentProfile(
    @Param('id') profileId: string,
    @Body() updatePaymentProfileDto: createPaymentProfileDto,
  ) {
    return this.paymentChargifyService.updatePaymentProfile(
      profileId,
      updatePaymentProfileDto,
    );
  }

  @Post('/subscription')
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.paymentChargifyService.createSubscription(
      createSubscriptionDto,
    );
  }

  @Put('/subscription/:id')
  async updateSubscription(
    @Param('id') subscriptionId: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.paymentChargifyService.updateSubscription(
      subscriptionId,
      updateSubscriptionDto,
    );
  }

  @Post('/subscription/:id')
  async purgeSubscriptions(
    @Param('id') subscriptionId: string,
    @Query() query: PurgeQuery,
  ) {
    const stringifiedParams = paramsStringify(query);
    return this.paymentChargifyService.purgeSubscription(
      subscriptionId,
      stringifiedParams,
    );
  }

  // Invoices
  @Post('/invoice/:id')
  async createInvoice(
    @Param('id') subscription_id: string,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ) {
    return this.paymentChargifyService.createInvoice(
      subscription_id,
      createInvoiceDto,
    );
  }

  @Post('/invoice-void/:id')
  async voidInvoice(
    @Param('id') invoiceId: string,
    @Body() voidInvoiceDto: VoidInvoiceDto,
  ) {
    return this.paymentChargifyService.voidInvoice(invoiceId, voidInvoiceDto);
  }

  // Payment
  @Post('/payment/:id')
  async createPayment(
    @Param('id') invoiceId: string,
    @Body() voidInvoiceDto: createPaymentDto,
  ) {
    return this.paymentChargifyService.createPayment(invoiceId, voidInvoiceDto);
  }

  // Payment Profiles

  @Post('/payment-profile')
  async createPaymentProfile(
    @Req() request: Request,
    @Body() createPaymentProfileDto: createPaymentProfileDto,
  ) {
    const email: string = get(request, ['user', 'email']) as string;
    return this.paymentChargifyService.createPaymentProfile(
      email,
      createPaymentProfileDto,
    );
  }

  // subscription components

  @Get('/subscription-components/:subscriptionId')
  public async getSubscriptionComponents(
    @Param('subscriptionId') subscriptionId: string,
  ) {
    return this.paymentChargifyService.getSubscriptionComponents(
      subscriptionId,
    );
  }

  @Post('/preview-allocation/:subscriptionId')
  async createPreviewAllocation(
    @Param('subscriptionId') subscriptionId: string,
    @Body() createPreviewDto: CreatePreviewAllocationDto,
  ) {
    return this.paymentChargifyService.createPreviewAllocation(
      subscriptionId,
      createPreviewDto,
    );
  }

  @Post('/allocate-component')
  async allocateComponent(@Body() allocationDto: AllocateComponentDto) {
    return this.paymentChargifyService.allocateComponent(allocationDto);
  }

  @ApiKeyOnly()
  @Post('payment-status')
  paymentStatus(@Body() dto: PaymentStatusDto) {
    return this.paymentsWebsocketGateway.sendPaymentStatus(dto);
  }
}

import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import {
  ResponseUpgradePlanDto,
  UpgradePlanDto,
} from './dto/paymentProfile.dto';
import { UpgradePlanService } from './upgrade-plan.service';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { SubscriptionResponseObject } from '@/payments/chargify/domain/types';

@Controller({ path: 'upgrade-plan', version: '1' })
export class UpgradePlanController {
  constructor(private readonly upgradePlanService: UpgradePlanService) {}

  @Post('/plan-upgrade/')
  public planUpgrade(
    @Body() upgradePlanDto: UpgradePlanDto,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ): Promise<ResponseUpgradePlanDto | boolean> {
    return this.upgradePlanService.planUpgrade(customer, upgradePlanDto);
  }

  @Get('/identify-account')
  async identifyAccount(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ): Promise<{ value: boolean }> {
    const { email } = customer;
    return this.upgradePlanService.identifyAccount(email);
  }

  @Post('/migrate-subscription/:planComponentHandle')
  async migrateSubscription(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Param('planComponentHandle') planComponentHandle: string,
  ): Promise<SubscriptionResponseObject | null> {
    const { email } = customer;
    return this.upgradePlanService.migrateSubscription(
      email,
      planComponentHandle,
    );
  }
}

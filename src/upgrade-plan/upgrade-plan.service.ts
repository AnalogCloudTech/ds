import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import {
  ComponentDto,
  ProductResult,
  State,
  SubscriptionResponseObject,
} from '@/payments/chargify/domain/types';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { get, isEmpty } from 'lodash';
import {
  IntervalInterface,
  ResponseUpgradePlanDto,
  UpgradePlanDto,
} from './dto/paymentProfile.dto';
import { ProductsService } from '@/onboard/products/products.service';
import { UpdateSubscriptionDto } from '@/payments/payment_chargify/dto/subscription.dto';
import { PaymentsService } from '@/legacy/dis/legacy/payments/payments.service';
import {
  Product,
  ProductDocument,
} from '@/onboard/products/schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import {
  convertToHSDate,
  epochToHSDate,
} from '@/internal/common/utils/dateFormatters';
import {
  DEAL_DEAL_STAGE_ID,
  DEAL_PIPELINE_ID,
} from '@/legacy/dis/legacy/hubspot/constants';
import { DateTime } from 'luxon';
import { LoggerPayload } from '@/internal/utils/logger';
import Stripe from 'stripe';
import { CONTEXT_CHARGIFY_DEAL } from '@/internal/common/contexts';
import { Allocation } from '@/payments/payment_chargify/dto/components.dto';
import { retry } from '@/internal/utils/functions';

type ProductSubscriptionDTO = {
  productId: string;
  subscriptionId: string;
};

@Injectable()
export class UpgradePlanService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private logger: Logger,
    private paymentChargifyService: PaymentChargifyService,
    private readonly productsService: ProductsService,
    private readonly hubspotService: HubspotService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async planUpgrade(
    customer: CustomerDocument,
    upgradePlanDto: UpgradePlanDto,
  ): Promise<ResponseUpgradePlanDto | null> {
    const { planComponentHandle, paymentProfileId, flow, isPlusPlan } =
      upgradePlanDto;
    const componentData: ComponentDto =
      await this.paymentChargifyService.getComponentDetails(
        planComponentHandle,
      );
    if (isEmpty(componentData)) {
      return null;
    }

    const { id: planPriceid } = componentData.component;

    const productData = await this.productsService.findProductByChargifyId(
      planPriceid.toString(),
    );
    if (isEmpty(productData)) {
      return null;
    }
    const paymentProfile = await this.paymentChargifyService.getPaymentProfile(
      paymentProfileId,
    );
    if (isEmpty(paymentProfile)) {
      return null;
    }
    const subscriptionDetails =
      await this.paymentChargifyService.getAllActiveSubscriptionsFromCustomerEmail(
        customer.email,
      );
    if (isEmpty(subscriptionDetails)) {
      return null;
    }

    let subscriptionData = subscriptionDetails[0];

    const deal = await this.hubspotService.getActiveMemberListDeal(
      customer.email,
    );
    if (deal) {
      const dealSubscriptionId = get(
        deal,
        ['properties', 'chargify_subscription_id'],
        '',
      );
      const subData = subscriptionDetails.find(
        (sub) => sub.id.toString() === dealSubscriptionId,
      );

      if (subData) {
        subscriptionData = subData;
      }
    }

    const {
      id: subscriptionId,
      state,
      credit_card,
      product: subProduct,
    } = subscriptionData;

    if (state === State.TRIALING && !isPlusPlan) {
      return null;
    }

    const billingNext = {
      interval: subProduct.interval,
      interval_unit: subProduct.interval_unit,
    };

    const changePaymentProfile = credit_card.id === paymentProfileId;
    if (!changePaymentProfile) {
      await this.paymentChargifyService.changePaymentProfileForSubscription(
        subscriptionId.toString(),
        paymentProfileId,
      );
    }

    if (flow === 'family-change') {
      const productFromChargify: ProductResult =
        await this.paymentChargifyService.getProductByHandle(
          productData.chargifyProductHandle,
        );
      billingNext.interval = productFromChargify.product.interval;
      billingNext.interval_unit = productFromChargify.product.interval_unit;
    }

    const updateSubscriptionDto: UpdateSubscriptionDto = {
      subscription: {
        next_billing_at: this.getTimeDate(billingNext),
      },
    };

    if (flow === 'family-change') {
      updateSubscriptionDto.subscription.product_handle =
        productData.chargifyProductHandle;
    }

    await this.paymentChargifyService.updateSubscription(
      subscriptionId.toString(),
      updateSubscriptionDto,
    );

    await this.waitUntilPaymentStatusArrives({
      productId: subscriptionData.product.id.toString(),
      subscriptionId: subscriptionId.toString(),
    });

    const allocateCompObject = {
      subscriptionId,
      newComponentId: Number(planPriceid),
    };

    let result: Allocation;
    if (isPlusPlan) {
      result = await this.paymentChargifyService.allocateOnce(
        allocateCompObject,
        state,
      );
      if (state === State.TRIALING) {
        await this.paymentChargifyService.activateSubscription(subscriptionId, {
          revert_on_failure: true,
        });
      }
    } else {
      result = await this.paymentChargifyService.allocateComponent(
        allocateCompObject,
      );
    }

    return {
      result,
      subscriptionData,
      paymentProfile,
      productData,
    };
  }

  getTimeDate(intervalObject: IntervalInterface): string {
    const dt = new Date();
    const { interval_unit, interval } = intervalObject;
    if (interval_unit == 'day') {
      dt.setDate(dt.getDate() + Number(interval));
    }
    if (interval_unit == 'month') {
      dt.setMonth(dt.getMonth() + Number(interval));
    }
    return `${dt.toISOString()} EDT`;
  }

  splitName(name: string) {
    const nameArr = name.split(' ');
    const first = nameArr.slice(0, nameArr.length - 1).join(' ');
    const last = nameArr[nameArr.length - 1];

    return { first, last };
  }

  async migrateSubscription(
    email: string,
    planComponentHandle: string,
  ): Promise<SubscriptionResponseObject | null> {
    if (!email) {
      throw new HttpException(
        {
          message: 'Email is required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const componentData: ComponentDto =
      await this.paymentChargifyService.getComponentDetails(
        planComponentHandle,
      );
    if (isEmpty(componentData)) {
      return null;
    }
    const { id: planPriceid } = componentData.component;

    await this.productsService.findProductByChargifyId(planPriceid.toString());
    const isStripeSubscription = await this.identifyAccount(email);
    if (!isStripeSubscription.value) {
      throw new HttpException(
        {
          message: 'This account is not stripe account',
        },
        HttpStatus.OK,
      );
    }
    const dealData = await this.hubspotService.findActiveDealsByEmail(email);
    const dealId = get(dealData, ['results', '0', 'id']) as string;
    const subscriptionId = get(dealData, [
      'results',
      '0',
      'properties',
      'stripe_subscription_id',
    ]) as string;
    try {
      const subscriptionDetails = <Stripe.Subscription>(
        await this.paymentsService.getSubscriptionBySubscriptionId(
          subscriptionId,
        )
      );
      const customer = subscriptionDetails.customer as string;
      const customerDetails = (await this.paymentsService.getCustomer(
        customer,
      )) as Stripe.Customer;
      const fullName =
        get(customerDetails, ['metadata', 'name']) ||
        get(customerDetails, ['name']) ||
        get(customerDetails, ['shipping', 'name']);

      const splitedName = this.splitName(fullName);
      const nextBillingAt = get(subscriptionDetails, 'current_period_end');
      const cardDetails = await this.paymentsService.getPaymentMethods(email);
      let card_type = '';
      let expiration_month = '';
      let expiration_year = '';
      let last_four = '';
      for (const card of cardDetails.data) {
        const defaultCard = card.default;
        if (defaultCard) {
          card_type = card.brand;
          expiration_month = card.expMonth.toString();
          expiration_year = card.expYear.toString();
          last_four = card.last4.toString();
        }
      }
      const productInfo = await this.productModel.findOne({
        chargifyComponentId: planPriceid,
      });
      const contactInfo = {
        email: customerDetails.email,
        phone: customerDetails.phone,
      };
      const customerAddressInfo = get(
        customerDetails,
        'address',
        {},
      ) as Partial<Stripe.Event.Data.Object>;

      const {
        line1: address1,
        line2: address2,
        postal_code: zip,
        country,
        state,
        city,
      }: { [key: string]: string } = customerAddressInfo || {};

      const customerAddress = {
        city,
        country,
        state,
        address1,
        address2,
        address: `${address1} ${address2}`,
        zip,
      };
      const {
        address1: addressOne,
        address2: addressTwo,
        ...rest
      } = customerAddress;
      const productHandle = get(productInfo, 'chargifyProductHandle');
      const chargifySubscriptionPayload = {
        subscription: {
          product_handle: productHandle,
          next_billing_at: nextBillingAt && epochToHSDate(nextBillingAt),
          components: [
            {
              component_id: planPriceid,
              allocated_quantity: 1,
            },
          ],
          customer_attributes: {
            first_name: splitedName?.first,
            last_name: splitedName?.last,
            ...contactInfo,
            ...rest,
          },
          credit_card_attributes: {
            first_name: splitedName?.first,
            last_name: splitedName?.last,
            card_type: card_type,
            expiration_month: expiration_month,
            expiration_year: expiration_year,
            last_four: last_four,
            vault_token: customer.toString(),
            current_vault: 'stripe_connect',
          },
        },
      };
      const chargifySybscription =
        await this.paymentChargifyService.createSubscription(
          chargifySubscriptionPayload,
        );

      const reqBody = {
        properties: {
          [productInfo.productProperty ?? 'authorify_product']:
            productInfo.title,
          recurring_revenue_amount: productInfo.value?.toString(10),
          dealname: this.hubspotService.createDealName(
            chargifySybscription.subscription,
            chargifySybscription.subscription.customer,
            productInfo,
          ),
          pipeline: DEAL_PIPELINE_ID,
          dealstage: DEAL_DEAL_STAGE_ID,
          stripe_subscription_id: '',
          chargify_subscription_id:
            chargifySybscription?.subscription.id.toString(10),
          status: this.hubspotService.translateStripeStatusToHubspot(
            chargifySybscription?.subscription.state,
          ),
          amount: productInfo.value.toString(10),
          contact_email: get(chargifySybscription, [
            'subscription',
            'customer',
            'email',
          ]),
          first_name: get(chargifySybscription, [
            'subscription',
            'customer',
            'first_name',
          ]),
          last_name: get(chargifySybscription, [
            'subscription',
            'customer',
            'last_name',
          ]),
          next_recurring_date: chargifySybscription?.subscription
            ?.current_period_ends_at
            ? convertToHSDate(
                chargifySybscription?.subscription?.current_period_ends_at,
              )
            : DateTime.now().plus({ months: 1 }).toFormat('yyyy-LL-dd'),
        },
      };
      const user = await this.hubspotService.getContactDetailsByEmail(email);
      await this.hubspotService.updateDeal(dealId, reqBody);
      const updateCreditsAndPackagesDto = {
        id: user.vid.toString(),
        credits: productInfo.creditsOnce
          ? productInfo.creditsOnce
          : productInfo.creditsRecur,
        packages: [productInfo.bookPackages],
      };
      await this.hubspotService.updateCreditsAndPackages(
        updateCreditsAndPackagesDto,
      );
      await this.paymentsService.cancelSubscription(subscriptionId);
      return chargifySybscription;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error({
          payload: <LoggerPayload>{
            usageDate: DateTime.now(),
            context: CONTEXT_CHARGIFY_DEAL,
            stack: error?.stack,
            error: error?.message,
            message:
              'Something went wrong while convert from stripe to chargify',
          },
        });
        throw new HttpException(
          {
            message:
              'Something went wrong while convert from stripe to chargify',
            error: error.message,
            name: error.name,
            stack: error.stack,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async identifyAccount(email: string): Promise<{ value: boolean }> {
    if (!email) {
      throw new HttpException(
        {
          message: 'Email is required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const dealData = await this.hubspotService.findActiveDealsByEmail(email);
      const identifyStripe = get(dealData, [
        'results',
        '0',
        'properties',
        'stripe_subscription_id',
      ]) as string;
      if (identifyStripe) {
        return { value: true };
      }
      return { value: false };
    } catch (e) {
      if (e instanceof Error)
        throw new HttpException(
          {
            message: 'Something went wrong with identify account',
            name: e.name,
            error: e.message,
            stack: e.stack,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  private async waitUntilPaymentStatusArrives(dto: ProductSubscriptionDTO) {
    if (!dto.productId || !dto.subscriptionId) {
      throw new Error('missing productId or subscriptionId');
    }
    await retry(
      async () =>
        this.paymentChargifyService.findPaymentStatusBySubscriptionId(
          dto.productId,
          dto.subscriptionId,
        ),
      {
        delay: 1000,
        maxRetries: 5,
      },
    );
  }
}

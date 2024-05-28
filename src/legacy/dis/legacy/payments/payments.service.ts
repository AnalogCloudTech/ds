import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { each, find, first, get, map, pick, omit } from 'lodash';
import {
  isoToEpoch,
  nowEpoch,
  timeElapsed,
  toISO,
} from '../common/utils/dateFormatters';
import { ListResponse } from './dto/common.dto';
import {
  CreateSubscriptionDto,
  ListItem,
  ProrationBehavior,
  SubscriptionProrationDto,
  SubscriptionProrationResponse,
  SubscriptionUpdateParams,
  UpgradeSubscriptionDto,
  UpgradeSubscriptionResponse,
} from './dto/subscription.dto';
import { Customer } from './dto/customer.dto';
import { Invoice, InvoiceResponse } from './dto/invoice.dto';
import {
  Card,
  PaymentMethod,
  PaymentMethodTypes,
} from './dto/payment-method.dto';
import { PaymentGateway } from './gateways/payment-gateway.interface';
import { CmsService } from '@/cms/cms/cms.service';
import {
  AVAILABLE_PLANS_TYPES,
  SUBSCRIPTION_UPGRADE_EXPIRY,
} from './payments.constants';
import {
  CmsFilterBuilder,
  CmsFilterObject,
  CmsSubQueryObject,
} from '@/internal/utils/cms/filters/cms.filter.builder';
import { Stripe } from 'stripe';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
import {
  ComponentInfo,
  ProductPackageAttributes,
  ProductPackages,
} from './types';
import { ErrorInfo } from '@/payments/payment_chargify/types';
import { SubscriptionComponent } from '@/payments/chargify/domain/types';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject('PAYMENT_GATEWAY') private readonly paymentGateway: PaymentGateway,
    private readonly cmsService: CmsService,
    private readonly paymentChargifyService: PaymentChargifyService,
  ) {}

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    return this.paymentGateway.createSubscription(createSubscriptionDto);
  }

  async upgradeSubscription(dto: UpgradeSubscriptionDto) {
    const { subscriptionId, newPriceId, prorationDate, paymentMethodId } = dto;
    const prorationDateEpoch = isoToEpoch(prorationDate);
    const subscription = await this.paymentGateway.getSubscription(
      subscriptionId,
    );
    await this.validateSubscriptionUpgrade(prorationDateEpoch);
    const items = [
      {
        id: get(subscription, ['items', 'data', 0, 'id'], 'No ID'),
        price: newPriceId,
      },
    ];
    const upgradeOptions: SubscriptionUpdateParams = {
      proration_behavior: ProrationBehavior.CREATE_PRORATIONS,
      proration_date: prorationDateEpoch,
      cancel_at_period_end: false,
      default_payment_method: paymentMethodId,
      billing_cycle_anchor: 'now',
      trial_end: 'now',
    };

    const upgradedSubscription = await this.paymentGateway.updateSubscription(
      subscriptionId,
      items,
      upgradeOptions,
    );
    const subscriptionItems = get(upgradedSubscription, ['items', 'data'], []);
    const listItems: ListItem[] = subscriptionItems.map((i) => {
      return {
        priceId: i.price.id,
        nickName: i.price.nickname,
        amount: i.price.unit_amount,
        interval: i.price.recurring.interval,
        intervalCount: i.price.recurring.interval_count,
        quantity: i.quantity,
      };
    });
    const {
      billing_cycle_anchor,
      current_period_end,
      current_period_start,
      status,
      trial_end,
    } = upgradedSubscription;

    const res: UpgradeSubscriptionResponse = {
      listItems,
      billingCycleAnchor: toISO(billing_cycle_anchor),
      currentPeriodEnd: toISO(current_period_end),
      currentPeriodStart: toISO(current_period_start),
      status: status,
      trialEnd: toISO(trial_end),
    };
    return res;
  }

  async getProration(email, dto: SubscriptionProrationDto) {
    const { subscriptionId, newPriceId } = dto;
    const prorationDate = nowEpoch();
    const subscription = await this.paymentGateway.getSubscription(
      subscriptionId,
    );

    await this.validateSubscriptionUpgrade(prorationDate);

    const items = [
      {
        id: get(subscription, ['items', 'data', 0, 'id'], 'No ID'),
        price: newPriceId,
      },
    ];

    let invoice = await this.paymentGateway.getUpcomingInvoice(
      subscription.id,
      items,
      prorationDate,
      1,
    );

    let nextPaymentAttempt: string;

    if (subscription.status === 'trialing' && invoice.total === 0) {
      invoice = await this.paymentGateway.getUpcomingInvoice(
        subscription.id,
        items,
        prorationDate,
        prorationDate,
      );
      nextPaymentAttempt = toISO(subscription.trial_end);
    }
    const newPrice = find(get(invoice, ['lines', 'data'], []), (lineItem) => {
      return get(lineItem, ['price', 'id'], 'No ID') === newPriceId;
    });
    const lineItems = map(get(invoice, ['lines', 'data']), (lineItem) => {
      return {
        amount: lineItem.amount,
        description: lineItem.description,
      };
    });
    const res: SubscriptionProrationResponse = {
      subscriptionId: invoice.subscription as string,
      amountDue: invoice.amount_due,
      amountRemaining: invoice.amount_remaining,
      amountPaid: invoice.amount_paid,
      prorationDate: toISO(invoice.subscription_proration_date ?? null),
      subTotal: invoice.subtotal,
      total: invoice.total,
      nextPaymentAttempt:
        nextPaymentAttempt ?? toISO(invoice.next_payment_attempt),
      startingBalance: invoice.starting_balance,
      newPriceId: get(newPrice, ['price', 'id'], 'No ID'),
      newPriceNickname: get(newPrice, ['price', 'nickname'], 'No Nickname'),
      newPriceValue: get(newPrice, ['price', 'unit_amount'], 0),
      lineItems,
    };
    return res;
  }

  async validateSubscriptionUpgrade(prorationDate): Promise<boolean> {
    const upgradeTimeExpirey = SUBSCRIPTION_UPGRADE_EXPIRY;
    const prorationDateExpired =
      timeElapsed(prorationDate, 'minutes') > upgradeTimeExpirey;
    if (prorationDateExpired) {
      throw new HttpException(
        {
          message:
            'Your upgrade/downgrade session has expired, please retry again',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  async createOrUpdateCustomer(customer: Customer) {
    const foundCustomer = await this.paymentGateway.findCustomerByEmail(
      customer.email,
    );

    if (foundCustomer) {
      const customerId = foundCustomer.id;
      return this.paymentGateway.updateCustomer(customerId, customer);
    }
    return this.paymentGateway.createCustomer(customer);
  }

  async updateCustomerPaymentMethod(
    customerId: string,
    paymentMethodId: string,
  ) {
    const foundCustomer = <Stripe.Customer>(
      await this.paymentGateway.findCustomerById(customerId)
    );

    if (!foundCustomer) {
      throw new HttpException(
        { message: 'customer not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    foundCustomer.invoice_settings.default_payment_method = paymentMethodId;

    return this.paymentGateway.updateCustomer(
      customerId,
      <Customer>foundCustomer,
    );
  }

  async getProductsPlans(
    currentPlanInterval: string,
    queryString: string,
    componentInfo: ComponentInfo,
  ): Promise<ProductPackages[]> {
    const TOTAL_MONTHS = 12;
    const {
      componentId: currentPlanId,
      componentUnitPrice: currentPlanAmount,
    } = componentInfo;

    const response = await this.cmsService.productPackages(queryString);
    return response?.map((plan) => {
      const {
        attributes: {
          paidMonthly = '0',
          paidAnnually = '0',
          priceIdMonthly,
          priceIdAnnually,
        },
      } = plan || {};
      plan.attributes.amount = { monthly: paidMonthly, annually: paidAnnually };
      plan.attributes.priceId = {
        monthly: priceIdMonthly,
        annually: priceIdAnnually,
      };
      plan.attributes.saveAmount =
        parseInt(paidMonthly, 10) * TOTAL_MONTHS - parseInt(paidAnnually, 10);
      plan.attributes.buttonText = currentPlanId
        ? this.getButtonText(
            currentPlanId,
            currentPlanInterval,
            priceIdAnnually,
            priceIdMonthly,
            currentPlanAmount,
            paidMonthly,
            paidAnnually,
          )
        : { monthly: 'Upgrade', annually: 'Upgrade' };
      let planAttributes = plan.attributes;
      planAttributes = <ProductPackageAttributes>(
        omit(planAttributes, [
          'priceIdMonthly',
          'priceIdAnnually',
          'paidMonthly',
          'paidAnnually',
          'createdAt',
          'updatedAt',
          'publishedAt',
        ])
      );

      return { ...plan, attributes: planAttributes };
    });
  }

  getButtonText = (
    currentPlanId: string,
    currentPlanInterval: string,
    priceIdAnnually: string,
    priceIdMonthly: string,
    currentPlanAmount: string,
    paidMonthly: string,
    paidAnnually: string,
  ): { monthly: string; annually: string } => {
    const paidPeriod: string =
      currentPlanInterval === 'monthly' ? paidMonthly : paidAnnually;
    if (currentPlanId === priceIdMonthly) {
      return { monthly: 'Current Plan', annually: 'Switch To Annual' };
    }
    if (currentPlanId === priceIdAnnually) {
      return { monthly: 'Switch To Monthly', annually: 'Current Plan' };
    }
    return this.isDowngradeOrUpgrade(
      parseInt(currentPlanAmount, 10),
      parseInt(paidPeriod, 10),
    );
  };

  isDowngradeOrUpgrade = (currentPlanAmount: number, amount: number) =>
    currentPlanAmount > amount
      ? { monthly: 'Downgrade', annually: 'Downgrade' }
      : { monthly: 'Upgrade', annually: 'Upgrade' };

  updateCustomer(id: string, customer: Customer) {
    return this.paymentGateway.updateCustomer(id, customer);
  }

  getCustomer(id: string) {
    return this.paymentGateway.getCustomer(id);
  }

  findCustomerByEmail(email: string) {
    return this.paymentGateway.findCustomerByEmail(email);
  }

  async getInvoices(email: string) {
    const customer = await this.paymentGateway.findCustomerByEmail(email);
    if (!customer) {
      throw new HttpException(
        { message: `No customer was found for the provided data: ${email}` },
        HttpStatus.NOT_FOUND,
      );
    }
    const customerId = customer.id;
    const invoices = await this.paymentGateway.getAllInvoices(customerId);

    return this.buildGetInvoicesResponseObject(email, invoices);
  }

  async getPaymentMethods(email: string, type?: PaymentMethodTypes) {
    const customer = await this.paymentGateway.findCustomerByEmail(email);
    if (!customer) {
      throw new HttpException(
        { message: `No customer was found for the provided data: ${email}` },
        HttpStatus.NOT_FOUND,
      );
    }
    const customerId = customer.id;
    const defaultSource =
      (customer.default_source as string) ||
      (customer.invoice_settings.default_payment_method as string);
    const paymentMethods = await this.paymentGateway.getPaymentMethods(
      customerId,
      type,
    );

    return this.buildGetPaymentsResponseObject(
      email,
      paymentMethods,
      defaultSource,
    );
  }

  async getSubscriptionByCustomer(email: string, isAllActiveRequired = false) {
    const customer = await this.paymentGateway.findCustomerByEmail(email);
    if (!customer) {
      throw new HttpException(
        { message: `No customer was found for the provided data: ${email}` },
        HttpStatus.NOT_FOUND,
      );
    }
    const subscriptions = customer.subscriptions.data;
    if (isAllActiveRequired) {
      return this.buildSubscriptionObject(subscriptions);
    }
    const filteredProductId = subscriptions.map(
      (subscription) => subscription['plan']['id'],
    );
    const filterObjects: CmsFilterObject[] = [];
    filterObjects.push(<CmsFilterObject>{
      name: 'priceIdMonthly',
      operator: '$in',
      value: filteredProductId,
    });
    filterObjects.push(<CmsFilterObject>{
      name: 'priceIdAnnually',
      operator: '$in',
      value: filteredProductId,
    });

    const subQuery = <CmsSubQueryObject>{
      operator: '$or',
      value: filterObjects,
    };

    const filteredAuthorifySubcsriptions = subscriptions?.filter(
      (subscription) => {
        let required = false;
        if (!isAllActiveRequired) {
          const {
            plan: { nickname },
          }: any = subscription;
          const isAuthorifyMembership =
            nickname &&
            nickname.includes('Authorify') &&
            AVAILABLE_PLANS_TYPES.some((v) => nickname.includes(v)) &&
            nickname.includes('Membership');
          if (isAuthorifyMembership) {
            required = true;
          } else if (!nickname) {
            required = true;
          }
        }
        return required;
      },
    );

    const queryString = '?' + CmsFilterBuilder.buildSubQuery(subQuery);
    const plans = await this.cmsService.productPackages(queryString);
    let subscriptionWithPlanDetails = [];
    if (get(plans, 'length')) {
      subscriptionWithPlanDetails = filteredAuthorifySubcsriptions?.map(
        (subscription) => {
          const data: any = { ...subscription };
          each(
            plans,
            ({
              attributes,
              attributes: { priceIdMonthly, priceIdAnnually },
            }: any) => {
              const planId = get(data, ['plan', 'id']);
              if ([priceIdMonthly, priceIdAnnually].includes(planId)) {
                data.attributes = attributes;
              }
            },
          );
          return data;
        },
      );
    }
    const subscriptionObj = this.buildSubscriptionObject(
      subscriptionWithPlanDetails,
    );
    return {
      ...subscriptionObj,
      ...pick(
        first(plans),
        'attributes.planName',
        'attributes.plusPlan',
        'attributes.licensedBooks',
        'attributes.printedBooks',
      ),
    };
  }

  private buildSubscriptionObject(subscription) {
    return pick(first(subscription), [
      'current_period_end',
      'plan.nickname',
      'plan.currency',
      'plan.amount',
      'plan.interval',
      'plan.interval_count',
      'plan.id',
      'status',
      'id',
    ]);
  }

  async getPlans(
    email: string,
    plusPlan: string,
  ): Promise<Partial<ProductPackages[]>> {
    const filterObjects: CmsFilterObject[] = [
      <CmsFilterObject>{
        name: 'plusPlan',
        operator: '$eq',
        value: plusPlan || false,
      },
    ];
    const queryString = '?' + CmsFilterBuilder.build(filterObjects);
    const currentSubscription =
      await this.paymentChargifyService.getSubscriptionsFromEmail(email);

    const subscriptionComponent =
      (await this.paymentChargifyService.getSubscriptionComponents(
        currentSubscription?.id,
      )) as SubscriptionComponent;
    const currentProductIntervalUnit = <string>(
      get(currentSubscription, 'product.interval_unit')
    );
    const currentPlanInterval = <string>(
      (currentProductIntervalUnit === 'month' ? 'monthly' : 'anually')
    );

    const componentId = subscriptionComponent?.component_id;
    const componentPriceDetails =
      await this.paymentChargifyService.getComponentPriceByPricePointId(
        componentId,
      );
    const componentUnitPrice = get(
      componentPriceDetails,
      'prices[0].unit_price',
    );
    try {
      if (!JSON.parse(plusPlan)) {
        return this.getProductsPlans(currentPlanInterval, queryString, {
          componentId: componentId.toString(),
          componentUnitPrice,
        });
      }
    } catch (error) {
      const { response: errorResponse, message } = error as ErrorInfo;
      throw new HttpException(message, errorResponse?.status);
    }
    return [];
  }

  public cancelSubscription(
    subscriptionId: string,
  ): Promise<Stripe.Response<Stripe.Subscription>> {
    return this.paymentGateway.cancelSubscription(subscriptionId);
  }

  public async getSubscriptionBySubscriptionId(
    subscriptionId: string,
  ): Promise<Stripe.Response<Stripe.Subscription>> {
    return this.paymentGateway.getSubscription(subscriptionId);
  }
  private buildGetPaymentsResponseObject(
    email: string,
    paymentMethods: PaymentMethod[],
    defaultPaymentMethodId: string,
  ): ListResponse<Card> {
    const cards = paymentMethods.map((method) => {
      const type = method.type;
      const brand = method.card.brand;
      const methodResponse: Card = {
        brand: brand,
        country: get(method, [type, 'country'], '') as string,
        expMonth: get(method, [type, 'exp_month']) as number,
        expYear: get(method, [type, 'exp_year']) as number,
        last4: get(method, [type, 'last4'], '') as string,
        email,
        default: get(method, ['id'], -1) === defaultPaymentMethodId,
        id: get(method, ['id'], ''),
      };
      return methodResponse;
    });

    return {
      count: cards.length,
      data: cards,
    };
  }

  private buildGetInvoicesResponseObject(
    email: string,
    paymentMethods: Invoice[],
  ): ListResponse<InvoiceResponse> {
    const invoices = paymentMethods.map((invoice) => {
      const invoiceResponse: InvoiceResponse = {
        amountDue: invoice.amount_due,
        amountPaid: invoice.amount_paid,
        amountRemaining: invoice.amount_remaining,
        total: invoice.total,
        billingReason: invoice.billing_reason,
        created: invoice.created,
        email: invoice.customer_email || email,
        status: invoice.status,
        paidDate: invoice.status_transitions.paid_at,
      };
      return invoiceResponse;
    });

    return {
      count: invoices.length,
      data: invoices,
    };
  }
}

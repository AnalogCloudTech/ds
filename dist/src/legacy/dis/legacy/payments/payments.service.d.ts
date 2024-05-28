import { ListResponse } from './dto/common.dto';
import { CreateSubscriptionDto, SubscriptionProrationDto, SubscriptionProrationResponse, UpgradeSubscriptionDto, UpgradeSubscriptionResponse } from './dto/subscription.dto';
import { Customer } from './dto/customer.dto';
import { InvoiceResponse } from './dto/invoice.dto';
import { Card, PaymentMethodTypes } from './dto/payment-method.dto';
import { PaymentGateway } from './gateways/payment-gateway.interface';
import { CmsService } from '@/cms/cms/cms.service';
import { Stripe } from 'stripe';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
import { ComponentInfo, ProductPackages } from './types';
export declare class PaymentsService {
    private readonly paymentGateway;
    private readonly cmsService;
    private readonly paymentChargifyService;
    constructor(paymentGateway: PaymentGateway, cmsService: CmsService, paymentChargifyService: PaymentChargifyService);
    createSubscription(createSubscriptionDto: CreateSubscriptionDto): Promise<any>;
    upgradeSubscription(dto: UpgradeSubscriptionDto): Promise<UpgradeSubscriptionResponse>;
    getProration(email: any, dto: SubscriptionProrationDto): Promise<SubscriptionProrationResponse>;
    validateSubscriptionUpgrade(prorationDate: any): Promise<boolean>;
    createOrUpdateCustomer(customer: Customer): Promise<any>;
    updateCustomerPaymentMethod(customerId: string, paymentMethodId: string): Promise<any>;
    getProductsPlans(currentPlanInterval: string, queryString: string, componentInfo: ComponentInfo): Promise<ProductPackages[]>;
    getButtonText: (currentPlanId: string, currentPlanInterval: string, priceIdAnnually: string, priceIdMonthly: string, currentPlanAmount: string, paidMonthly: string, paidAnnually: string) => {
        monthly: string;
        annually: string;
    };
    isDowngradeOrUpgrade: (currentPlanAmount: number, amount: number) => {
        monthly: string;
        annually: string;
    };
    updateCustomer(id: string, customer: Customer): any;
    getCustomer(id: string): any;
    findCustomerByEmail(email: string): Promise<Stripe.Customer>;
    getInvoices(email: string): Promise<ListResponse<InvoiceResponse>>;
    getPaymentMethods(email: string, type?: PaymentMethodTypes): Promise<ListResponse<Card>>;
    getSubscriptionByCustomer(email: string, isAllActiveRequired?: boolean): Promise<Partial<unknown>>;
    private buildSubscriptionObject;
    getPlans(email: string, plusPlan: string): Promise<Partial<ProductPackages[]>>;
    cancelSubscription(subscriptionId: string): Promise<Stripe.Response<Stripe.Subscription>>;
    getSubscriptionBySubscriptionId(subscriptionId: string): Promise<Stripe.Response<Stripe.Subscription>>;
    private buildGetPaymentsResponseObject;
    private buildGetInvoicesResponseObject;
}

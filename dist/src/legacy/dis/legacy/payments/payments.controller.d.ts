import { Stripe as StripeLib } from 'stripe';
import { Request } from 'express';
import { CreateSubscriptionDto, SubscriptionProrationDto, UpgradeSubscriptionDto } from './dto/subscription.dto';
import { Customer } from './dto/customer.dto';
import { PaymentsService } from './payments.service';
import { PaymentPlansQueryFilters, ProductPackages } from '@/legacy/dis/legacy/payments/types';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createSubscription(createSubscriptionDto: CreateSubscriptionDto): Promise<any>;
    upgradeSubscription(upgradeSubscriptionDto: UpgradeSubscriptionDto): Promise<import("./dto/subscription.dto").UpgradeSubscriptionResponse>;
    getProration(subscriptionProrationDto: SubscriptionProrationDto, request: Request): Promise<import("./dto/subscription.dto").SubscriptionProrationResponse>;
    createOrUpdateCustomer(customer: Customer): Promise<any>;
    findCustomerByEmail(email: string): Promise<StripeLib.Customer>;
    getPaymentMethods(request: Request): Promise<import("./dto/common.dto").ListResponse<import("./dto/payment-method.dto").Card>>;
    getPayments(request: Request): Promise<import("./dto/common.dto").ListResponse<import("./dto/invoice.dto").InvoiceResponse>>;
    getSubscriptionByCustomer(request: Request, active: string | boolean): Promise<Partial<unknown>>;
    getCustomer(id: string): Promise<StripeLib.Customer>;
    updateCustomer(customer: Customer, id: string): Promise<StripeLib.Customer>;
    productPackages(filters: PaymentPlansQueryFilters, request: Request): Promise<ProductPackages[]>;
}

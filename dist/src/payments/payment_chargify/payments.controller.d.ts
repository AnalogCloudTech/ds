import { PaymentChargifyService } from './payments.service';
import { Request } from 'express';
import { CreateSubscriptionDto, PurgeQuery, UpdateSubscriptionDto } from './dto/subscription.dto';
import { CreateInvoiceDto, VoidInvoiceDto } from './dto/invoice.dto';
import { createPaymentDto } from './dto/payment.dto';
import { createPaymentProfileDto } from './dto/paymentProfile.dto';
import { AllocateComponentDto, CreatePreviewAllocationDto } from './dto/components.dto';
import { PaymentProfiles, Invoice, PaymentProfile, CreditCard } from '../chargify/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { PaymentsWebsocketGateway } from '@/payments/payment_chargify/gateways/payments.gateway';
import { PaymentStatusDto } from '@/payments/payment_chargify/dto/payment-status.dto';
import DateRangeDTO from '@/internal/common/dtos/date-range.dto';
import { Paginator, PaginatorSchematicsInterface } from '@/internal/utils/paginator';
export declare class PaymentChargifyController {
    private readonly paymentChargifyService;
    private readonly paymentsWebsocketGateway;
    constructor(paymentChargifyService: PaymentChargifyService, paymentsWebsocketGateway: PaymentsWebsocketGateway);
    getPaymentProfilesFromEmail(request: Request, body?: {
        user: {
            email: string;
        };
    }): Promise<PaymentProfiles[]>;
    getPaymentProfilesListFromEmail(customer: CustomerDocument): Promise<PaymentProfile[]>;
    getShowCreditsButton(customer: CustomerDocument): Promise<boolean>;
    getMemberActiveList({ page, perPage }: Paginator, { startDate, endDate }: DateRangeDTO, customer: CustomerDocument): Promise<PaginatorSchematicsInterface<Invoice> | []>;
    getSubscriptionsFromEmail(request: Request, active?: string): Promise<Partial<import("../chargify/domain/types").Subscription> | Partial<import("./dto/subscription.dto").CurrentSubscriptionDto>>;
    getDefaultPaymentProfile(customer: CustomerDocument): Promise<CreditCard>;
    changeDefaultPaymentProfile(request: Request, paymentProfileId: string): Promise<Array<PaymentProfiles>>;
    deletePaymentProfile(profileId: string, customer: CustomerDocument): Promise<{
        message: string;
    }>;
    updatePaymentProfile(profileId: string, updatePaymentProfileDto: createPaymentProfileDto): Promise<PaymentProfiles>;
    createSubscription(createSubscriptionDto: CreateSubscriptionDto): Promise<import("../chargify/domain/types").SubscriptionResponseObject & import("../chargify/domain/types").CreateSubscriptionErrorResponseObject>;
    updateSubscription(subscriptionId: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<import("../chargify/domain/types").SubscriptionResponseObject>;
    purgeSubscriptions(subscriptionId: string, query: PurgeQuery): Promise<import("../chargify/domain/types").SubscriptionResponseObject>;
    createInvoice(subscription_id: string, createInvoiceDto: CreateInvoiceDto): Promise<import("../chargify/domain/types").SubscriptionInvoice>;
    voidInvoice(invoiceId: string, voidInvoiceDto: VoidInvoiceDto): Promise<Invoice>;
    createPayment(invoiceId: string, voidInvoiceDto: createPaymentDto): Promise<Invoice>;
    createPaymentProfile(request: Request, createPaymentProfileDto: createPaymentProfileDto): Promise<PaymentProfiles>;
    getSubscriptionComponents(subscriptionId: string): Promise<import("../chargify/domain/types").SubscriptionComponent | import("../chargify/domain/types").SubscriptionComponent[]>;
    createPreviewAllocation(subscriptionId: string, createPreviewDto: CreatePreviewAllocationDto): Promise<import("./dto/components.dto").AllocationPreview>;
    allocateComponent(allocationDto: AllocateComponentDto): Promise<import("./dto/components.dto").Allocation>;
    paymentStatus(dto: PaymentStatusDto): boolean;
}

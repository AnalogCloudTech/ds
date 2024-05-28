import { Logger } from '@nestjs/common';
import { ChargifyService } from '@/payments/chargify/chargify.service';
import { subscriptionFilters } from './payments.constants';
import { CreditCard, Customer, Invoice, Metadata, MetadataPaginationSchema, PaymentProfile, PaymentProfiles, State, Subscription, SubscriptionComponent, SubscriptionInvoice, SubscriptionResponseObject, ProductResult, ComponentDto, SendInvoiceEmails, CreateSubscriptionErrorResponseObject } from '@/payments/chargify/domain/types';
import { ComponentPriceInfoDto, CreateSubscriptionDto, CurrentSubscriptionDto, Events, UpdateSubscriptionDto } from './dto/subscription.dto';
import { ActivateSubscription, AllocateComponentDto, Allocation, Allocations, CreatePreviewAllocationDto } from './dto/components.dto';
import { createPaymentProfileDto } from './dto/paymentProfile.dto';
import { CreateInvoiceDto, VoidInvoiceDto } from './dto/invoice.dto';
import { createPaymentDto } from './dto/payment.dto';
import { PaymentsWebsocketGateway } from '@/payments/payment_chargify/gateways/payments.gateway';
import { PaymentStatusDto } from '@/payments/payment_chargify/dto/payment-status.dto';
import { SchemaId } from '@/internal/types/helpers';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { ProductsService } from '@/onboard/products/products.service';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { CmsService } from '@/cms/cms/cms.service';
export declare class PaymentChargifyService {
    private productsService;
    private readonly chargifyService;
    private readonly paymentSocketGateway;
    private readonly cmsService;
    private readonly logger;
    constructor(productsService: ProductsService, chargifyService: ChargifyService, paymentSocketGateway: PaymentsWebsocketGateway, cmsService: CmsService, logger: Logger);
    find<T = any>(url: string, params?: Record<string, any>): Promise<T>;
    createSubscription(createSubscriptionDto: CreateSubscriptionDto): Promise<SubscriptionResponseObject & CreateSubscriptionErrorResponseObject>;
    updateSubscription(subscriptionId: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<SubscriptionResponseObject>;
    findSubscriptionById(subscriptionId: string): Promise<SubscriptionResponseObject>;
    purgeSubscription(subscriptionId: string, query: string): Promise<SubscriptionResponseObject>;
    activateSubscription(subscriptionId: number, activateSubscription: ActivateSubscription): Promise<SubscriptionResponseObject>;
    createInvoice(subscriptionId: string, createInvoiceDto: CreateInvoiceDto): Promise<SubscriptionInvoice>;
    voidInvoice(invoiceId: string, updateInvoiceDto: VoidInvoiceDto): Promise<Invoice>;
    createPayment(invoiceId: string, createPaymentDto: createPaymentDto): Promise<Invoice>;
    createPaymentProfile(userEmail: string, createPaymentDto: createPaymentProfileDto): Promise<PaymentProfiles>;
    updatePaymentProfile(paymentProfileId: string, updatePaymentProfileDto: createPaymentProfileDto): Promise<PaymentProfiles>;
    getPaymentProfile(paymentProfileId: string): Promise<PaymentProfiles>;
    getComponentDetails(handle: string): Promise<ComponentDto>;
    getMetadataForResource(resourceType: string, resourceId: number): Promise<MetadataPaginationSchema>;
    setMetadataForResource(resourceType: 'subscriptions' | 'customers', resourceId: number, metadata: Array<Pick<Metadata, 'name' | 'value'>>): Promise<any>;
    getCustomerInfoFromEmail(customerEmail: string): Promise<Customer>;
    getPaymentProfilesFromEmail(email: string): Promise<PaymentProfiles[]>;
    getPaymentProfilesListFromEmail(email: string): Promise<PaymentProfile[]>;
    getShowCreditsButton(email: string): Promise<boolean>;
    getBillingHistory(customer: CustomerDocument, startDate: string, endDate: string, page?: number, perPage?: number): Promise<PaginatorSchematicsInterface<Invoice> | []>;
    getComponentsBySubscriptionId(subscriptionId: string | number): Promise<SubscriptionComponent[]>;
    isExpired(paymentProfile: PaymentProfile): boolean;
    getSubscriptionEvents(subscriptionId: number): Promise<Events[]>;
    getSubscriptionBySubId(subscriptionId: string): Promise<{
        subscription: Subscription;
    } | null>;
    getInvoiceByInvoiceId(invoiceId: string): Promise<Invoice | null>;
    sendInvoice(invoiceId: string, reqObject: SendInvoiceEmails): Promise<any>;
    addEventNameInSubscription(subscriptions: Array<Subscription>): Promise<{
        billingReason: string;
        message: string;
        component: SubscriptionComponent;
        id?: number;
        state?: State;
        activated_at?: string;
        balance_in_cents?: string;
        cancel_at_end_of_period?: string;
        canceled_at?: string;
        cancellation_message?: string;
        coupon_code?: string;
        created_at?: string;
        current_period_ends_at?: string;
        current_period_started_at?: string;
        delayed_cancel_at?: string;
        expires_at?: string;
        next_assessment_at?: string;
        previous_state?: string;
        payment_type?: string;
        signup_payment_id?: string;
        signup_revenue?: string;
        total_revenue_in_cents?: string;
        trial_ended_at?: string;
        trial_started_at?: string;
        updated_at?: string;
        currency?: string;
        customer?: Customer;
        product?: import("@/payments/chargify/domain/types").Product;
        credit_card?: CreditCard;
        product_price_in_cents?: number;
        last_payment_error?: import("@/payments/chargify/domain/types").LastPaymentError;
        name?: string;
    }[]>;
    getOnlySubscriptionsFromCustomerEmail(email: string): Promise<Array<Subscription> | null>;
    getSubscriptionsFromEmail(email: string, isAllActiveRequired?: keyof typeof subscriptionFilters): Promise<Partial<Subscription> | Partial<CurrentSubscriptionDto>>;
    getDefaultPaymentProfile(email: string): Promise<CreditCard>;
    changeDefaultPaymentProfile(email: string, paymentProfileId: string): Promise<Array<PaymentProfiles>>;
    deletePaymentProfile(profileId: string, email: string): Promise<{
        message: string;
    }>;
    changePaymentProfileForSubscription(subscription_id: string, paymentProfileId: string): Promise<PaymentProfiles>;
    getSubscriptionComponents(subscriptionId: string | number, isAllListRequired?: boolean): Promise<SubscriptionComponent | SubscriptionComponent[]>;
    createPreviewAllocation(subscriptionId: string, createPreviewDto: CreatePreviewAllocationDto): Promise<import("./dto/components.dto").AllocationPreview>;
    getAllocation(result: Allocations[]): Promise<Allocation>;
    allocateOnce(allocationDto: AllocateComponentDto, state: State): Promise<Allocation>;
    allocateComponent(allocationDto: AllocateComponentDto): Promise<Allocation>;
    getComponentPriceByPricePointId(componentId: number): Promise<ComponentPriceInfoDto>;
    getProductByHandle(handle: string): Promise<ProductResult>;
    getAllSubscriptionsFromCustomerEmail(email: string): Promise<Array<Subscription>>;
    getAllActiveSubscriptionsFromCustomerEmail(email: string): Promise<Array<Subscription> | null>;
    getComponentsFromSubscription(subscription: Subscription): Promise<Array<SubscriptionComponent>>;
    getAllAllocatedComponentsFromSubscription(subscription: Subscription): Promise<Array<SubscriptionComponent>>;
    migrateSubscription(subscriptionId: number, newComponentId: number): Promise<SubscriptionResponseObject>;
    sendSuccessPaymentEventToSocket(dto: Pick<PaymentStatusDto, 'id' | 'email'>): boolean;
    sendSuccessUpsellPaymentEventToSocket(dto: Pick<PaymentStatusDto, 'id' | 'email'> & {
        sessionId: SchemaId;
        offerCode: string;
    }): boolean;
    sendRmSuccessEventToSocket(dto: Pick<PaymentStatusDto, 'id' | 'email'>): boolean;
    private addComponentUnitPriceInComponent;
    private buildSubscriptionObject;
    private generalCreate;
    private generalUpdate;
    private generalDelete;
    currentSubscriptionIsRM(customer: CustomerDocument): Promise<boolean>;
}

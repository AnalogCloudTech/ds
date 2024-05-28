import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { SubscriptionResponseObject } from '@/payments/chargify/domain/types';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
import { Logger } from '@nestjs/common';
import { IntervalInterface, ResponseUpgradePlanDto, UpgradePlanDto } from './dto/paymentProfile.dto';
import { ProductsService } from '@/onboard/products/products.service';
import { PaymentsService } from '@/legacy/dis/legacy/payments/payments.service';
import { ProductDocument } from '@/onboard/products/schemas/product.schema';
import { Model } from 'mongoose';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
export declare class UpgradePlanService {
    private readonly productModel;
    private logger;
    private paymentChargifyService;
    private readonly productsService;
    private readonly hubspotService;
    private readonly paymentsService;
    constructor(productModel: Model<ProductDocument>, logger: Logger, paymentChargifyService: PaymentChargifyService, productsService: ProductsService, hubspotService: HubspotService, paymentsService: PaymentsService);
    planUpgrade(customer: CustomerDocument, upgradePlanDto: UpgradePlanDto): Promise<ResponseUpgradePlanDto | null>;
    getTimeDate(intervalObject: IntervalInterface): string;
    splitName(name: string): {
        first: string;
        last: string;
    };
    migrateSubscription(email: string, planComponentHandle: string): Promise<SubscriptionResponseObject | null>;
    identifyAccount(email: string): Promise<{
        value: boolean;
    }>;
}

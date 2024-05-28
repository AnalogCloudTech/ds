import { ResponseUpgradePlanDto, UpgradePlanDto } from './dto/paymentProfile.dto';
import { UpgradePlanService } from './upgrade-plan.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { SubscriptionResponseObject } from '@/payments/chargify/domain/types';
export declare class UpgradePlanController {
    private readonly upgradePlanService;
    constructor(upgradePlanService: UpgradePlanService);
    planUpgrade(upgradePlanDto: UpgradePlanDto, customer: CustomerDocument): Promise<ResponseUpgradePlanDto | boolean>;
    identifyAccount(customer: CustomerDocument): Promise<{
        value: boolean;
    }>;
    migrateSubscription(customer: CustomerDocument, planComponentHandle: string): Promise<SubscriptionResponseObject | null>;
}

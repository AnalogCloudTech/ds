import { SubscriptionStatus } from '@/customers/customers/domain/types';
import { SchemaId } from '@/internal/types/helpers';
export declare class CreateCustomerSubscriptionDto {
    customer: SchemaId;
    status: SubscriptionStatus;
    subscriptionId: string;
    previousState: string;
}

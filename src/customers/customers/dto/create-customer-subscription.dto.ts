import { IsEnum, IsNotEmpty } from 'class-validator';
import { SubscriptionStatus } from '@/customers/customers/domain/types';
import { SchemaId } from '@/internal/types/helpers';

export class CreateCustomerSubscriptionDto {
  @IsNotEmpty()
  customer: SchemaId;

  @IsNotEmpty()
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @IsNotEmpty()
  subscriptionId: string;

  @IsNotEmpty()
  previousState: string;
}

import { Events } from '@/customers/customer-events/domain/types';
import { IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateCustomerEventDto {
  @IsEnum(Events)
  @IsNotEmpty()
  event: string;

  @IsObject()
  @IsOptional()
  metadata?: object;
}

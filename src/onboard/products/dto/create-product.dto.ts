import { Type } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ChargifyId, StripeId } from '../domain/types';

export class CreateProductDto {
  @IsString()
  @Expose()
  title: string;

  @IsString()
  @Expose()
  stripeId: StripeId;

  @IsString()
  @Expose()
  type: Type;

  @IsString()
  @Expose()
  chargifyComponentId: ChargifyId;

  @IsString()
  @Expose()
  chargifyProductHandle: ChargifyId;

  @IsString()
  @Expose()
  chargifyProductPriceHandle: ChargifyId;

  @IsOptional()
  @Expose()
  toShowBuyCredits: boolean;
}

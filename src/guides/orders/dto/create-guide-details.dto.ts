import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { FrontCover, Address } from '@/guides/orders/domain/guide-orders';

export class CreateGuideDetailsDto {
  @Expose()
  frontCover: FrontCover[];

  @IsString()
  @IsNotEmpty()
  practiceName: string;

  @IsNotEmpty()
  practiceAddress: Address;

  @IsString()
  @IsNotEmpty()
  practicePhone: string;

  @IsString()
  @IsNotEmpty()
  practiceLogo: string;

  @IsString()
  @IsOptional()
  practiceWebsite: string;

  @IsString()
  @IsOptional()
  practiceEmail: string;

  @IsNotEmpty()
  shippingAddress: Address;
}

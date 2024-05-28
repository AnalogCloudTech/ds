import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import {
  FrontCover,
  OrderStatus,
  Address,
} from '@/guides/orders/domain/guide-orders';
import { PartialType } from '@nestjs/mapped-types';

export class CreateGuideOrderDto {
  @Type(() => FrontCover)
  @Expose()
  frontCover: FrontCover[];

  @IsString()
  @IsNotEmpty()
  practiceName: string;

  @Type(() => Address)
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

  @IsString()
  guideId: string;

  @IsString()
  guideName: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  @IsString()
  @IsOptional()
  landingPage?: string;

  @IsString()
  @IsOptional()
  readPage?: string;

  @Type(() => Address)
  @IsNotEmpty()
  shippingAddress: Address;

  @IsString()
  @IsOptional()
  sessionId?: string;
}

export class UpdateGuideDto extends PartialType(CreateGuideOrderDto) {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}

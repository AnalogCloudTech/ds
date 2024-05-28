import { Expose, Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ObjectId } from 'mongoose';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';

export class FrontCover {
  @IsString()
  @Expose()
  image: string;

  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  title: string;
}

export class Address {
  @IsString()
  @Expose()
  addressLine1: string;

  @IsString()
  @Expose()
  city: string;

  @IsString()
  @Expose()
  state: string;

  @IsString()
  @Expose()
  pincode: string;

  @IsString()
  @Expose()
  country: string;

  @IsString()
  @IsOptional()
  @Expose()
  email?: string;

  @IsString()
  @IsOptional()
  @Expose()
  firstName?: string;

  @IsString()
  @IsOptional()
  @Expose()
  lastName?: string;
}

export enum OrderStatus {
  Pending = 'pending',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Shipped = 'shipped',
}

export class GuideOrders {
  @Expose()
  customer: ObjectId | CustomerDocument;

  @Type(() => FrontCover)
  @Expose()
  frontCover: FrontCover;

  @IsString()
  @Expose()
  practiceName: string;

  @Type(() => Address)
  @Expose()
  practiceAddress: Address;

  @IsString()
  @Expose()
  practicePhone: string;

  @IsString()
  @Expose()
  practiceLogo: string;

  @IsOptional()
  @Expose()
  practiceWebsite?: string;

  @IsOptional()
  @Expose()
  practiceEmail?: string;

  @IsNumber()
  @Expose()
  quantity: number;

  @IsString()
  @Expose()
  thumbnail: string;

  @IsString()
  @Expose()
  guideName: string;

  @IsString()
  @IsOptional()
  @Expose()
  guideId?: string;

  @IsEnum(OrderStatus)
  @IsOptional()
  @Expose()
  status?: string;

  @IsOptional()
  @IsString()
  @Expose()
  landingPage?: string;

  @IsOptional()
  @IsString()
  @Expose()
  readPage?: string;

  @Type(() => Address)
  @Expose()
  shippingAddress: Address;
}

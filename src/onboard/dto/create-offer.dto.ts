import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Addon } from '../domain/addon';
import { Webinar } from '../domain/webinar';
import {
  OfferCode,
  OfferImageUrl,
  OfferType,
  PaymentProcessorId,
} from '../domain/types';
import { ProductInfo } from '../domain/product-info';
import { Workflow } from '../schemas/offer.schema';

export class CreateOfferDto {
  paymentId?: PaymentProcessorId;

  @IsString()
  @Expose()
  code: OfferCode = null;

  @IsString()
  @Expose()
  title: string = null;

  @IsNumber()
  @Expose()
  trial: number;

  @Type(() => ProductInfo)
  @Expose()
  productInfo: ProductInfo[];

  @IsString()
  @Expose()
  description1: string = null;

  @IsString()
  @Expose()
  description2: string = null;

  @IsArray()
  @Expose()
  whatsIncluded: string[] = [];

  @IsString()
  @Expose()
  image: OfferImageUrl = null;

  @Expose()
  type: OfferType = OfferType.MAIN;

  @IsObject()
  @Expose()
  workFlow: Workflow;

  @Type(() => Addon)
  @IsOptional()
  @Expose()
  addons: Addon[] = [];

  @Expose()
  products: string[];

  @Expose()
  bookOptions: string[];

  @Expose()
  @IsOptional()
  webinar?: Webinar;
}

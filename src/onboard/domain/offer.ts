import {
  AccountType,
  OfferCode,
  OfferImageUrl,
  OfferType,
  PaymentProcessorId,
} from './types';
import { ProductInfo } from './product-info';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { BookOption } from './book-option';
import { Workflow } from '../schemas/offer.schema';
export class ContractedOffer {
  code: string;
  title: string;
  amount: number;
  monthlyPrice: number;
  save?: number;
  recurrance: string;
}
export class Offer {
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

  @IsArray()
  @Expose()
  @Type(() => BookOption)
  bookOptions: BookOption[];

  @IsArray()
  @Expose()
  @Type(() => BookOption)
  bookOptionsCA: BookOption[];

  @Expose()
  type: OfferType = OfferType.MAIN;

  @IsObject()
  @Expose()
  workFlow: Workflow;

  @Expose()
  accountType: AccountType;

  @Expose()
  freeBooks: number;

  @IsArray()
  @Type(() => ContractedOffer)
  @Expose()
  paymentOptions?: ContractedOffer[];
}

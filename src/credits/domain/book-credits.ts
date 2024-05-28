import { ExposeId } from '@/internal/common/interceptors/serialize.interceptor';
import { CreateProductDto } from '@/onboard/products/dto/create-product.dto';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export enum CreditType {
  Book = 'book',
  Guide = 'guide',
  HolidaySale = 'holiday-sale',
}
export class BookCredits {
  @Expose()
  @ExposeId()
  id: string;

  @Expose()
  credits: number;

  @Expose()
  perAmount: number;

  @Expose()
  totalAmount: number;

  @Expose()
  isActive: boolean;

  @Expose()
  @IsEnum(CreditType)
  @IsOptional()
  type?: CreditType;

  @Expose()
  @Type(() => CreateProductDto)
  product?: CreateProductDto;

  @Expose()
  @IsOptional()
  savings?: string;
}

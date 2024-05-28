import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive, IsString,
} from 'class-validator';
import { CreditType } from '@/credits/domain/book-credits';

export class CreateBookCreditsDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  credits: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  perAmount: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  isActive: boolean;

  @IsEnum(CreditType)
  @IsOptional()
  type?: CreditType;

  @IsString()
  @IsOptional()
  savings?: string;
}

import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, } from 'class-validator';
import { Type } from 'class-transformer';
import { Segments } from '@/campaigns/email-campaigns/leads/domain/types';
import { CustomerEmailDto } from '@/internal/common/dtos/customer-email.dto';
import { SegmentsDto } from '@/internal/common/dtos/segments.dto';
import { Address } from './address';

export class CreateLeadDto implements CustomerEmailDto, SegmentsDto {
  /**
   * Lead's first name
   *
   * @example 'John'
   */
  @IsString()
  @IsNotEmpty()
  firstName: string;

  /**
   * Lead's last name
   *
   * @example 'Doe'
   */
  @IsString()
  @IsNotEmpty()
  lastName: string;

  /**
   * Lead's e-mail
   *
   * @example 'johndoe@mail.com'
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Lead's phone
   *
   * @example '999 999 999'
   */
  @IsOptional()
  @IsString()
  phone?: string;

  /**
   * List of Segments
   *
   * @example ["number", "number"]
   */
  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  segments: Segments;

  @IsNotEmpty()
  @IsBoolean()
  allSegments: boolean;

  @IsEmail()
  @IsOptional()
  customerEmail: string;

  /**
   * BookId from STRAPI
   *
   * @example 'ObjectID'
   */
  @IsOptional()
  bookId: string;

  isValid: boolean;
  unsubscribed: boolean;

  @IsOptional()
  address: Address;
}

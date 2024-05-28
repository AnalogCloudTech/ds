import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, } from 'class-validator';
import { Segments } from '@/campaigns/email-campaigns/leads/domain/types';
import { Type } from 'class-transformer';
import { Address } from './address';

export class CreateLeadFromPagesteadDto {
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
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  segments: Segments;

  @IsOptional()
  @IsBoolean()
  allSegments: boolean;

  @IsOptional()
  bookId: string;

  formId: string;

  @IsString()
  pageName: string;

  @IsString()
  pageTitle: string;

  @IsString()
  domain: string;

  @IsEmail()
  customerEmail: string;

  isValid: boolean;
  unsubscribed: boolean;

  @IsOptional()
  @ValidateNested()
  address: Address;
}

import { Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Address } from '../domain/address';
import { Attributes } from '../domain/attributes';
import { AccountType, Status } from '@/customers/customers/domain/types';

export class CreateCustomerDto {
  /**
   * Customer's first name
   *
   * @example 'John'
   */
  @IsString()
  @Expose()
  firstName: string;
  /**
   * Customer's last name
   *
   * @example 'Doe'
   */
  @IsString()
  @Expose()
  lastName: string;
  /**
   * Customer's email
   *
   * @example 'test@authorify.com'
   */
  @IsEmail()
  @Expose()
  email: string;

  /**
   * Customer's phone number
   *
   * @example '1234567890'
   */
  @IsString()
  @Expose()
  phone: string;

  /**
   * Billing details
   *
   */
  @ValidateNested()
  @Type(() => Address)
  @Expose()
  billing: Address;

  /**
   * Email Campaign Attributes
   *
   */
  @Type(() => Attributes)
  @Expose()
  attributes: Attributes;

  @Expose()
  @IsOptional()
  avatar?: string;
  /**
   * Customer's password
   *
   * @example 'hunter2'
   */
  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  chargifyToken?: string;

  @IsString()
  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;

  smsPreferences: {
    schedulingCoachReminders: boolean;
  };

  @IsEnum(Status)
  @IsOptional()
  status?: string;
}

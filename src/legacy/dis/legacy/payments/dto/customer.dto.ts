import { Type } from 'class-transformer';
import { IsEmail, IsString, ValidateNested, IsDefined } from 'class-validator';
import { Address } from './address.dto';

export class Customer {
  /**
   * Customer's full name
   *
   * @example 'John Doe'
   */
  @IsString()
  name: string;

  /**
   * Customer's email address
   *
   * @example 'john@gmail.com'
   */
  @IsEmail()
  email: string;

  /**
   * Customer's address
   *
   */
  @IsDefined()
  @ValidateNested()
  @Type(() => Address)
  address: Address;

  metadata?: any;
}

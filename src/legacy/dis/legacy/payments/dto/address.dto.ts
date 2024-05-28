import { IsNotEmpty, IsString, Length } from 'class-validator';

export class Address {
  /**
   * Customer's Two-letter country code (ISO 3166-1 alpha-2).
   *
   * @example 'US'
   */
  @Length(2, 2, { message: 'country must be 2 char (ISO 3166-1 alpha-2)' })
  @IsString()
  country: string;
  /**
   * Customer's State, county, province, or region.
   *
   * @example 'Florida'
   */
  @IsString()
  @IsNotEmpty()
  state: string;
  /**
   * Customer's City, district, suburb, town, or village.
   *
   * @example 'Sun beach'
   */
  @IsString()
  @IsNotEmpty()
  city: string;
  /**
   * Customer's Address line 1
   *
   * @example '(e.g., street, PO Box, or company name).'
   */
  @IsString()
  @IsNotEmpty()
  line1: string;
  /**
   * Customer's Address line 1
   *
   * @example '(e.g., apartment, suite, unit, or building).'
   */
  @IsString()
  line2: string;
  /**
   * Customer's ZIP or postal code
   *
   * @example '54321'
   */
  @IsString()
  @IsNotEmpty()
  postal_code: string;
}

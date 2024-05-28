import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Address {
  /**
   * Address line 1
   *
   * @example '51 Pine St.'
   */
  @IsString()
  @IsNotEmpty()
  @Expose()
  address1: string;

  /**
   * Address line 2
   *
   * @example 'Apartment 123'
   */
  @IsOptional()
  @IsString()
  @Expose()
  address2?: string;

  /**
   * City name
   *
   * @example 'Atlantic Beach'
   */
  @IsString()
  @Expose()
  city: string;

  /**
   * State name
   *
   * @example 'Florida'
   */
  @IsString()
  @IsNotEmpty()
  @Expose()
  state: string;

  /**
   * Zip code
   *
   * @example '12345'
   */
  @IsString()
  @IsNotEmpty()
  @Expose()
  zip: string;

  /**
   * Country abbreviation
   *
   * @example 'US'
   */
  @IsString()
  @IsNotEmpty()
  @Expose()
  country: string;
}

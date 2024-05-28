import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class Address {
  /**
   * Address line 1
   *
   * @example '51 Pine St.'
   */
  @IsString()
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
  @Expose()
  state: string;

  /**
   * Zip code
   *
   * @example '12345'
   */
  @IsString()
  @Expose()
  zip: string;

  /**
   * Country abbreviation
   *
   * @example 'US'
   */
  @IsString()
  @Expose()
  country: string;
}

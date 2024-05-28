import { Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Address } from './address';
import { Attributes } from './attributes';
import { CustomerId, HubspotId, StripeId } from './types';
import { ExposeId } from '@/internal/common/interceptors/serialize.interceptor';
import { FlippingBookPreferences } from '@/customers/customers/domain/flipping-book-preferences';
import { LandingPageWebsite } from '@/customers/customers/schemas/customer.schema';

export class Customer {
  /**
   * Customer's id
   */
  @IsMongoId()
  @Expose()
  @ExposeId()
  id: CustomerId;
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

  @Expose()
  fullName: string;
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

  @IsString()
  @Expose()
  hubspotId?: HubspotId;

  @IsString()
  @Expose()
  stripeId?: StripeId;

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

  @Type(() => FlippingBookPreferences)
  @Expose()
  flippingBookPreferences: FlippingBookPreferences;

  @Expose()
  @IsOptional()
  avatar?: string;

  @Expose()
  @IsOptional()
  landingPageProfile: LandingPageWebsite;
}

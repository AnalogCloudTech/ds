import { IsArray, IsBoolean, IsEmail, IsMongoId, IsOptional, IsString, } from 'class-validator';
import { Expose } from 'class-transformer';
import { LeadId, Segments } from './types';
import { Address } from '../dto/address';

export class Lead {
  @IsMongoId()
  @Expose()
  id: LeadId;

  @IsString()
  @Expose()
  firstName: string;

  @IsString()
  @Expose()
  lastName: string;

  @IsString()
  @IsEmail()
  @Expose()
  email: string;

  @IsString()
  @Expose()
  phone: string;

  @Expose()
  bookId: string;

  @Expose()
  customerEmail: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  allSegments: boolean;

  @IsArray()
  @IsOptional()
  @Expose()
  segments: Segments;

  @Expose()
  createdAt: Date;

  @Expose()
  isValid: boolean;

  @Expose()
  unsubscribed: boolean;

  @IsOptional()
  @Expose()
  address: Address;
}

import {
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { SchemaId } from '@/internal/types/helpers';

export class CreateCustomerPropertiesDto {
  @IsMongoId()
  customer: SchemaId;

  @IsString()
  @IsNotEmpty()
  module: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  customerEmail: string;

  @IsObject()
  @IsOptional()
  metadata?: { [key: string]: any };
}

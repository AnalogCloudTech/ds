import { SchemaId } from '@/internal/types/helpers';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateMagazineCoverLeadDto {
  @IsNotEmpty()
  @IsString()
  customerEmail: string;

  @IsNotEmpty()
  @IsString()
  year: string;

  @IsNotEmpty()
  @IsString()
  month: string;

  @ValidateNested()
  @Type(() => LeadDto)
  leads: LeadDto[];
}
export class LeadDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}

export class LeadCoversDto {
  @IsOptional()
  lead: SchemaId;

  @IsNotEmpty()
  @IsString()
  coversUrl: string;

  @IsOptional()
  @IsString()
  fullContentUrl: string;
}

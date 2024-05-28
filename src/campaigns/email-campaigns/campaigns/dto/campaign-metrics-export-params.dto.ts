import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SchemaId } from '@/internal/types/helpers';

export class CampaignMetricsExportParams {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  start: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  end: Date;

  @IsNotEmpty()
  @IsOptional()
  campaignIds: SchemaId[];

  @IsNotEmpty()
  @IsString()
  bucket: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

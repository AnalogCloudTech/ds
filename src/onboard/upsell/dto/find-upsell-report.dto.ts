import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  transformIsUpsell,
  transformSortBy,
} from '@/campaigns/email-campaigns/email-history/domain/types';

export class FindUpsellReportDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  endDate: string;

  @IsOptional()
  @Transform(transformSortBy)
  sortBy?: { [key: string]: number };
}

export class ColumnFilterDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customerEmail?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  offerName?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  channel?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  utmSource?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  utmMedium?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  utmContent?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  utmTerm?: string[];

  @IsOptional()
  @Transform(transformIsUpsell)
  isUpsell?: boolean;
}

export class UpsellCSVExportDTO {
  @IsOptional()
  reportIds?: string[];

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  endDate: string;

  @IsOptional()
  @Transform(transformSortBy)
  sortBy?: { [key: string]: number };

  @IsOptional()
  filter?: ColumnFilterDto;
}

export class UniqueSearchDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsNotEmpty()
  @IsString()
  field: string;
}

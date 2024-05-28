import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GenerationStatus } from '@/referral-marketing/magazines/schemas/generated-magazine.schema';
import { Optional } from '@nestjs/common';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator/paginator.schema';
import { MagazinePreviewType } from '../domain/types';

export class UpdateGeneratedMagazineStatusDto {
  @IsEnum(GenerationStatus)
  @IsOptional()
  status?: string;

  @Optional()
  @IsString()
  url?: string;

  @Optional()
  @IsString()
  flippingBookUrl?: string;

  @Optional()
  @IsString()
  coverImageHtml?: string;

  @Optional()
  @IsString()
  pageUrl?: string;

  @Optional()
  @IsString()
  bookUrl?: string;

  @IsEnum(GenerationStatus)
  @IsOptional()
  pageStatus?: string;

  @Optional()
  @IsString()
  coversOnlyUrl?: string;
}

export class GetAllGeneratedMagazinesMetricsDto {
  magazinesDetails: PaginatorSchematicsInterface<MagazinePreviewType>;
}

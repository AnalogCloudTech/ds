import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MonthsType } from '@/internal/utils/date';
import { MagazineStatus } from '@/referral-marketing/magazines/domain/types';

export class GetAllReportMetricsDto {
  @IsNotEmpty()
  @IsString()
  year: string;

  @IsNotEmpty()
  @IsString()
  month: MonthsType;

  @IsOptional()
  @IsString()
  status?: MagazineStatus;

  @IsOptional()
  @IsString()
  searchQuery?: string;
}

import { IsOptional, IsString } from 'class-validator';
import { MonthsType } from '@/internal/utils/date';
import { MagazineStatus } from '@/referral-marketing/magazines/domain/types';

export class ReportMagazinesDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @IsString()
  month?: MonthsType;

  @IsOptional()
  @IsString()
  status?: MagazineStatus;

  @IsOptional()
  @IsString()
  searchQuery?: string;
}

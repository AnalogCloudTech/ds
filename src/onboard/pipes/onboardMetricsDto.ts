import { IsOptional, IsString } from 'class-validator';

export default class OnBoardMetricsDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  searchQuery?: string;
}

import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { DateComparison } from '@/internal/utils/validation-rules/date-comparison.rule';
import { Type } from 'class-transformer';

export default class DateRangeDTO {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @DateComparison('endDate')
  startDate: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: string;
}

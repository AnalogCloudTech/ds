import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export default class Paginator {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  perPage?: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  sortBy?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  sortOrder?: string;
}

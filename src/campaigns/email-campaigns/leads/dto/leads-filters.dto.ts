import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class LeadsFiltersDTO {
  @IsOptional()
  email: string;

  @IsArray()
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }: { value: Array<string> }) => value?.map(Number))
  segments: Array<number>;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isValid: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  unsubscribed: boolean;
}

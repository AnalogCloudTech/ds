import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PreviewMagazineDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year: number;

  @IsOptional()
  @IsString()
  month: string;
}

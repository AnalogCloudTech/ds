import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { Type } from '@/guides/catalog/schemas/guide-catalog.schema';

export class GuideCatalog {
  @IsString()
  @Expose()
  guideName: string;

  @IsString()
  @Expose()
  guideId: string;

  @IsString()
  @Expose()
  thumbnail: string;

  @IsString()
  @IsOptional()
  @Expose()
  pdfUrl?: string;

  @IsNumber()
  @Expose()
  position: number;

  @IsEnum(Type)
  @Expose()
  type: Type;
}

import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from '@/guides/catalog/schemas/guide-catalog.schema';

export class CreateGuideCatalogDto {
  @IsString()
  @IsNotEmpty()
  guideName: string;

  @IsString()
  @IsNotEmpty()
  guideId: string;

  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  @IsString()
  @IsOptional()
  pdfUrl?: string;

  @IsNumber()
  @IsNotEmpty()
  position: number;

  @IsEnum(Type)
  @IsNotEmpty()
  type: Type;
}

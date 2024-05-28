import {
  IsBooleanString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Segments } from '@/campaigns/email-campaigns/leads/domain/types';
import { CustomerEmailDto } from '@/internal/common/dtos/customer-email.dto';

export class ImportLeadDto implements CustomerEmailDto {
  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  segments: Segments;

  @IsNotEmpty()
  @IsBooleanString()
  allSegments: string;

  @IsOptional()
  @IsEmail()
  customerEmail: string;

  @IsOptional()
  file: Express.Multer.File;

  @IsNotEmpty()
  bookId: string;
}

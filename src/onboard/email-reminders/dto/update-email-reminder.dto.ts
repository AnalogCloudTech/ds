import { SchemaId } from '@/internal/types/helpers';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateEmailReminderDto {
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  customer?: SchemaId;

  @IsMongoId()
  @IsOptional()
  @IsNotEmpty()
  coach?: SchemaId;

  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  session?: SchemaId;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  subject?: string;

  @IsNotEmpty()
  @IsUrl()
  @IsOptional()
  meetingLink?: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date?: Date;

  @IsNotEmpty()
  @IsOptional()
  timezone?: string;
}

import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SchemaId } from '@/internal/types/helpers';

export class CreateEmailReminderDto {
  @IsMongoId()
  @IsNotEmpty()
  customer: SchemaId;

  @IsMongoId()
  @IsNotEmpty()
  coach: SchemaId;

  @IsMongoId()
  @IsNotEmpty()
  session: SchemaId;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsUrl()
  meetingLink: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  meetingDate: Date;

  @IsNotEmpty()
  timezone: string;
}

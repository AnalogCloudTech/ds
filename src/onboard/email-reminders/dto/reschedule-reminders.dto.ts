import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RescheduleRemindersDto {
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  newMeetingDate: string;

  @IsOptional()
  @IsString()
  timezone?: string;
}

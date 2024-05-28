import { CoachImageUrl } from '@/onboard/domain/types';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CalendarId, HubspotId } from '../domain/types';

export class UpdateCoachDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  hubspotId: HubspotId;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image: CoachImageUrl;

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  calendarId: CalendarId;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsNumber()
  @IsOptional()
  schedulingPoints?: number;
}

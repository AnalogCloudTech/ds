import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CalendarId, CoachImageUrl, HubspotId } from '../domain/types';

export class CreateCoachDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
  enabled: boolean;
}

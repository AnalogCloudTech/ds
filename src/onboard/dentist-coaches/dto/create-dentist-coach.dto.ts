import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateDentistCoachDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  hubspotId: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsEmail()
  @IsNotEmpty()
  calendarId: string;

  @IsBoolean()
  @IsNotEmpty()
  enabled: boolean;
}

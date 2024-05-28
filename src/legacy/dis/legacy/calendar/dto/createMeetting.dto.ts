import { IsEmail, IsString } from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  contactId: string;

  @IsString()
  contactName: string;

  @IsEmail()
  contactEmail: string;

  @IsString()
  coachId: string;

  @IsString()
  coachName: string;

  @IsEmail()
  coachEmail: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsEmail()
  calendarId: string;

  @IsString()
  location: string;
}

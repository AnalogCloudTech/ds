import { IsArray, IsDate, IsEmail, IsString } from 'class-validator';

export class BusySlot {
  @IsString()
  meetingStart: string;

  @IsString()
  meetingEnd: string;

  @IsString()
  timeZone: string;
}

export class CalendarDto {
  @IsEmail()
  email: string;

  @IsDate()
  calendarDate: Date;

  @IsArray()
  BusySlots: BusySlot[];
}

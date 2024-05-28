import {
  IsArray,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { DateTime } from 'luxon';
import { Coach } from '@/onboard/domain/coach';

export class BusySlot {
  @IsString()
  meetingStart: string;

  @IsString()
  meetingEnd: string;
}

export class CalendarDto {
  @IsEmail()
  email: string;

  @IsDate()
  calendarDateStart: string;

  @IsDate()
  calendarDateEnd: string;

  @IsArray()
  BusySlots: BusySlot[];

  freeTimeSlots?: Array<DaySlots>;

  outputTimezone?: string;
}

export class CalendarDtoWithCoach extends CalendarDto {
  coach: Coach;
}

export class GetBusySlotsDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  date: string;

  @IsOptional()
  outputTimezone = 'UTC';
}

export class DaySlots {
  day: string;
  slots: Array<DateTime> = [];
}

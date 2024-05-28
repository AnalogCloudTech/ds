import { IsArray, IsString } from 'class-validator';

export class WebinarDto {
  @IsString()
  title: string;

  @IsArray()
  upcomingTimes: [string];

  @IsString()
  timeZoneId: string;
}

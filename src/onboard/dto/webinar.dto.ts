import { IsBoolean, IsDateString, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class WebinarDto {
  @IsString()
  @Expose()
  timezone: string;

  @IsBoolean()
  @Expose()
  sms: boolean;

  @IsDateString()
  @Expose()
  slot: string;
}

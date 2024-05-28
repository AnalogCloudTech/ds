import { IsString } from 'class-validator';

export class RegisterWebinarDto {
  @IsString()
  start_time: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  sms_number: string;
}

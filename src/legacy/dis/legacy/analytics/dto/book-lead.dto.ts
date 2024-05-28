import { IsDateString, IsEmail, IsString } from 'class-validator';

export class BookLeadDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsDateString()
  created: string;
}

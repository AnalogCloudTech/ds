import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UploadCustomMagazineDto {
  @IsEmail()
  userEmail: string;

  @IsString()
  @IsNotEmpty()
  month: string;

  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsNotEmpty()
  magazineURL: string;

  @IsString()
  @IsNotEmpty()
  coversURL: string;
}

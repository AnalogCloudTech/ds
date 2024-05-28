import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateCustomVerificationEmailDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  fromEmail: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsUrl()
  successRedirectUrl: string;

  @IsNotEmpty()
  @IsUrl()
  failureRedirectUrl: string;
}

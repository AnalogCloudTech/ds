import { IsEmail, IsOptional, IsUrl } from 'class-validator';

export class UpdateCustomVerificationEmailDto {
  @IsOptional()
  @IsEmail()
  fromEmail: string;

  @IsOptional()
  subject: string;

  @IsOptional()
  content: string;

  @IsOptional()
  @IsUrl()
  successRedirectUrl: string;

  @IsOptional()
  @IsUrl()
  failureRedirectUrl: string;
}

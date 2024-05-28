import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EqualTo } from '@/internal/utils/validation-rules/equal-to';

export class ContactDto {
  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  afy_password?: string;

  @IsString()
  @IsOptional()
  afy_password_encrypted?: string;

  @IsString()
  @IsOptional()
  afy_customer_login_token?: string;

  @IsString()
  @IsOptional()
  afy_customer_profile_image_url?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  account_type?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  zip?: string;

  @IsString()
  @IsOptional()
  afy_active?: string;

  @IsString()
  @IsOptional()
  afy_booklist?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateAfyPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @EqualTo('password')
  passwordConfirmation: string;

  encryptedPassword: string;
}

export class UpdateAfyPasswordAboDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  passwordConfirmation: string;

  encryptedPassword: string;
}
export class UpdateProfileAvatarDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  avatar: string;
}

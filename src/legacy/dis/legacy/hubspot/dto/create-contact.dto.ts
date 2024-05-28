import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  afy_password?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class UpdateContactDto {
  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zip: string;

  @IsString()
  country: string;

  @IsBoolean()
  @IsOptional()
  textMessageOptIn?: boolean;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;
}

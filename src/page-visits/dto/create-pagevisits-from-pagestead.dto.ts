import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePageVisitsFromPagesteadDto {
  /**
   * From pagestead itself it is coming as full name
   */
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  application: string;

  @IsString()
  domain: string;

  @IsOptional()
  customDomain: string;

  @IsString()
  @IsNotEmpty()
  appAction: string;

  @IsString()
  @IsNotEmpty()
  appSection: string;

  @IsNumber()
  usageCount: number;

  @IsOptional()
  @IsBoolean()
  usageDate: string;

  @IsNumber()
  read: number;

  @IsNumber()
  landing: number;

  @IsNumber()
  leads: number;

  @IsString()
  pageName: string;

  userAgent: string;
  remoteHost: string;
}

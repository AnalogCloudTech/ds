import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerTemplateDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;

  @IsString()
  @IsNotEmpty()
  subject?: string;

  @IsString()
  @IsOptional()
  bodyContent?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  templateTitle?: string;
}

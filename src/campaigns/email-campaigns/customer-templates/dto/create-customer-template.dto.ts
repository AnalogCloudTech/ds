import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { SchemaId } from '@/internal/types/helpers';
import { ExistsInCms } from '@/cms/cms/validation-rules/exists-in-cms';

export class CreateCustomerTemplateDto {
  customer: SchemaId;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsOptional()
  bodyContent?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  templateTitle?: string;

  @ValidateIf((self) => self.emailTemplate)
  @IsOptional()
  @ExistsInCms(['templateDetails'])
  emailTemplate?: number;
}

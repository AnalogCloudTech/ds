import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class VerifyProductDto {
  @IsString()
  productName: string;
  @IsString()
  @IsOptional()
  propertyKey?: string;
  @IsString()
  propertyValue: string;
}

export class ProductVerificationStatus {
  @IsBoolean()
  success: boolean;
  @IsString()
  message: string;
}

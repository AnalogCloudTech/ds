import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsOptional()
  productProperty?: string;

  @IsNotEmpty()
  @IsOptional()
  bookPackages?: string;

  @IsNotEmpty()
  @IsOptional()
  product?: string;

  @IsNotEmpty()
  @IsOptional()
  priceProperty?: string;

  @IsNotEmpty()
  @IsOptional()
  value?: number;

  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsNotEmpty()
  @IsOptional()
  creditsOnce?: number;

  @IsNotEmpty()
  @IsOptional()
  creditsRecur?: number;

  @IsNotEmpty()
  @IsOptional()
  stripeId?: string;

  @IsNotEmpty()
  @IsOptional()
  productDescription?: string;
}

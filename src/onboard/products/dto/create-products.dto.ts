import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  productProperty: string;

  @IsNotEmpty()
  bookPackages: string;

  @IsNotEmpty()
  product: string;

  @IsNotEmpty()
  priceProperty: string;

  @IsNotEmpty()
  value: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  creditsOnce: number;

  @IsNotEmpty()
  creditsRecur: number;

  @IsNotEmpty()
  stripeId: string;

  @IsNotEmpty()
  productDescription: string;
}

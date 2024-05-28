import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class ProductInfo {
  @IsString()
  @Expose()
  title: string;

  @IsString()
  @Expose()
  price: string;
}

import { IsOptional, IsString } from 'class-validator';

export class ProductSearchtDto {
  @IsOptional()
  @IsString()
  searchQuery?: string;
}

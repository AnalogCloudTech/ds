import { IsEnum, IsNotEmpty } from 'class-validator';
import { MediaType } from '../domain/type';

export class UpdateAttributeDto {
  @IsNotEmpty()
  @IsEnum(MediaType)
  mediaType?: string;

  @IsNotEmpty()
  pageAddress?: string;

  @IsNotEmpty()
  securityKey?: string;

  @IsNotEmpty()
  secretKey?: string;

  @IsNotEmpty()
  customerId?: string;
}

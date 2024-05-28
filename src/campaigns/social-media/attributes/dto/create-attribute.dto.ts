import { MediaType } from '../domain/type';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateAttributeDto {
  @IsNotEmpty()
  @IsEnum(MediaType)
  mediaType: string;

  @IsNotEmpty()
  pageAddress: string;

  @IsNotEmpty()
  securityKey: string;

  @IsNotEmpty()
  secretKey: string;

  @IsNotEmpty()
  customerId: string;
}

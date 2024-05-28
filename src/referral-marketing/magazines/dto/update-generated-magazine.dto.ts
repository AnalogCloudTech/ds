import { IsOptional, IsString } from 'class-validator';

export class UpdateGeneratedMagazineDto {
  @IsString()
  @IsOptional()
  additionalInformation?: string;

  @IsString()
  @IsOptional()
  pageUrl?: string;

  @IsString()
  @IsOptional()
  bookUrl?: string;

  @IsString()
  @IsOptional()
  flippingBookUrl?: string;
}

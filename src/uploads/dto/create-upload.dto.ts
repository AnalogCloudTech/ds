import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUploadDto {
  @IsOptional()
  @IsString()
  context: string;

  @IsString()
  @IsNotEmpty()
  bucket: string;

  @IsBoolean()
  @IsOptional()
  isPrivate: boolean;

  @IsString()
  @IsOptional()
  path?: string;

  @IsString()
  @IsNotEmpty()
  ext: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;
}

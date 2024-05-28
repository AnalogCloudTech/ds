import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { WebinarImageUrl } from './types';

export class Webinar {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @Expose()
  title: string;

  @IsString()
  @Expose()
  description: string;

  @IsString()
  @Expose()
  image: WebinarImageUrl;

  @IsString()
  @Expose()
  caption: string;

  @Expose()
  slots?: string[];
}

import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { BookOptionImageUrl } from './types';

export class BookOption {
  @IsString()
  @Expose()
  id: string;

  @IsString()
  @Expose()
  image: BookOptionImageUrl;
}

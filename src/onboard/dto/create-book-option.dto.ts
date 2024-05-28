import { IsMongoId, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { BookOptionImageUrl } from '../domain/types';

export class CreateBookOptionDto {
  @IsString()
  title: string;

  @IsMongoId()
  @Expose()
  bookId: string;

  @IsMongoId()
  @Expose()
  templateId: string;

  @IsString()
  @Expose()
  image: BookOptionImageUrl;
}

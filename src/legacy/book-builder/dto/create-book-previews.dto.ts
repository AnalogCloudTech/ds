import { IsMongoId, IsString, IsNotEmpty } from 'class-validator';
import { SchemaId } from '@/internal/types/helpers';

export class CreateBookPreviewsDto {
  @IsMongoId()
  bookId: SchemaId;

  @IsNotEmpty()
  @IsString()
  bookTitle: string;

  @IsNotEmpty()
  @IsString()
  pdfUrl: string;
}

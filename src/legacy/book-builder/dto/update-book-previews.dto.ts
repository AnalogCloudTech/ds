import { IsString, IsArray } from 'class-validator';

export class UpdateBookPreviewsDto {
  @IsString()
  bookTitle: string;

  @IsString()
  pdfUrl: string;
}

import { Expose } from 'class-transformer';
import { ExposeId } from '@/internal/common/interceptors/serialize.interceptor';
import { SchemaId } from '@/internal/types/helpers';

export class BookPreviewsDomain {
  @Expose()
  @ExposeId()
  id: SchemaId;

  @Expose()
  @ExposeId()
  bookId: string;

  @Expose()
  bookTitle: string;

  @Expose()
  pdfUrl: string;
}

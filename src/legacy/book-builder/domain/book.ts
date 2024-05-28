import { ExposeId } from '@/internal/common/interceptors/serialize.interceptor';
import { Expose } from 'class-transformer';

export class BookDomain {
  @Expose()
  @ExposeId()
  id: string;

  @Expose()
  title: string;

  @Expose()
  bookId: string;

  @Expose()
  customerId: string;

  @Expose()
  customLandingPageUrl: string;

  @Expose()
  digitalBookUrl: string;

  @Expose()
  landingPageUrl: string;
}

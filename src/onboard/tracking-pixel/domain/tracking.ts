import { Expose } from 'class-transformer';
import { ExposeId } from '@/internal/common/interceptors/serialize.interceptor';
import { SchemaId } from '@/internal/types/helpers';

export class TrackingPixelDomain {
  @Expose()
  @ExposeId()
  id: SchemaId;

  @Expose()
  offerCode: string;

  @Expose()
  trackingCode: string;
}

import { Expose } from 'class-transformer';

export class FlippingBookPreferences {
  @Expose()
  publicationId: string;

  @Expose()
  publicationName: string;

  @Expose()
  publicationUrl: string;

  @Expose()
  rawFileUrl: string;

  @Expose()
  permanentPublicationId: string;

  @Expose()
  permanentPublicationName: string;

  @Expose()
  permanentPublicationUrl: string;

  @Expose()
  permanentRawFileUrl: string;
}

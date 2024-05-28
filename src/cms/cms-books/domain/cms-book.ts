import { SchemaId } from '@/internal/types/helpers';
import { Expose, Transform, Type } from 'class-transformer';
import { ExposeId } from '@/internal/common/interceptors/serialize.interceptor';

export class Thumbnail {
  @Expose()
  @ExposeId()
  id: string;

  @Expose()
  name: string;

  @Expose()
  ext: string;

  @Expose()
  mime: string;

  @Expose()
  @Transform((object) => `${process.env.OLD_CMS_URL}${object.value}`)
  url: string;
}

export class CmsBookDomain {
  @Expose()
  @ExposeId()
  id: SchemaId;

  @Expose()
  name: string;

  @Expose()
  @Type(() => Thumbnail)
  thumbnail: Thumbnail;
}

import { Exclude, Expose } from 'class-transformer';

export class UploadDomain {
  @Exclude()
  context: string;

  @Exclude()
  bucket: string;

  @Expose()
  downloadUrl: string;

  @Expose()
  uploadUrl: string;

  @Expose()
  isPrivate: boolean;

  @Expose()
  ext?: string;
}

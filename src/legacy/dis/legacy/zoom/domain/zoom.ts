import { ExposeId } from '@/internal/common/interceptors/serialize.interceptor';
import { Expose } from 'class-transformer';
import { ZoomId } from './types';
export class Zoom {
  @Expose()
  @ExposeId()
  id: ZoomId;

  @Expose()
  hostEmail: string;

  @Expose()
  fileLocation: string;

  @Expose()
  bucketName: string;

  @Expose()
  keyName: string;

  @Expose()
  topic: boolean;

  @Expose()
  startTime: string;

  @Expose()
  zoomCloudDeletedAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt: Date;
}

export class ZoomMember {
  @Expose()
  @ExposeId()
  id: ZoomId;

  @Expose()
  hostEmail: string;

  @Expose()
  fullName: string;

  @Expose()
  zoomAwsUpload: boolean;

  @Expose()
  zoomAwsDelete: boolean;

  @Expose()
  zoomAppInstantDelete: boolean;

  @Expose()
  zoomAppLaterDelete: boolean;

  @Expose()
  zoomIQSalesAccount: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

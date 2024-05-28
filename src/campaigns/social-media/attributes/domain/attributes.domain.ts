import { IsMongoId } from 'class-validator';
import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class AttributeDomain {
  @IsMongoId()
  @Expose()
  id: ObjectId;

  @Expose()
  mediaType: string;

  @Expose()
  pageAddress: string;

  @Expose()
  securityKey: string;

  @Expose()
  secretKey: string;
}

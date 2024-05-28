import { IsMongoId } from 'class-validator';
import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class FacebookDomain {
  @IsMongoId()
  @Expose()
  id: ObjectId;

  @Expose()
  message: string;

  @Expose()
  photo: string;
}

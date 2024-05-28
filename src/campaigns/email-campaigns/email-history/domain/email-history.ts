import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { transformStatus, transformTitle, transformType } from './types';

export class EmailHistory {
  @Expose()
  id: ObjectId;

  @Expose()
  @Transform(transformTitle)
  title: string;

  @Expose()
  @Transform(({ obj }) => obj.relationType)
  type: string;

  @Expose()
  @Transform(transformType)
  templateName: string;

  @Expose()
  @Transform(transformStatus)
  status: string;

  @Expose()
  createdAt: Date;
}

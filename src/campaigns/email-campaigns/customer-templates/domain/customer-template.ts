import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class CustomerTemplate {
  @Expose()
  id: ObjectId;

  @Expose()
  templateId: number;

  @Expose()
  name: string;

  @Expose()
  subject: string;

  @Expose()
  content: string;

  @Expose()
  bodyContent?: string;

  @Expose()
  templateTitle?: string;

  @Expose()
  imageUrl?: string;
}

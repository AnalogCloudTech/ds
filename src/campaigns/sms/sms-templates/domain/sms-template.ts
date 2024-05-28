import { Expose } from 'class-transformer';

export class SmsTemplateDomain {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  createdAt: string;
}

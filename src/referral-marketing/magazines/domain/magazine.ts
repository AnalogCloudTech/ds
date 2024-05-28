import {
  Replacer,
  Selection,
} from '@/referral-marketing/magazines/domain/types';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';
import { ExposeId } from '@/internal/common/interceptors/serialize.interceptor';

@Expose()
export class MagazineDomain {
  @Expose()
  @ExposeId()
  id: Types.ObjectId;

  @Expose()
  @ExposeId()
  customer: Types.ObjectId;

  @Expose()
  month: string;

  @Expose()
  year: string;

  @Expose()
  selections: Selection[];

  /*
   * magazineID on STRAPI
   * */
  @Expose()
  magazineId: number;

  @Expose()
  baseReplacers: Replacer[];

  @Expose()
  status: string;

  @Expose()
  contentUrl: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

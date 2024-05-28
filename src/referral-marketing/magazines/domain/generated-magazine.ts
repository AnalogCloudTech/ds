import { Expose, Type } from 'class-transformer';
import { Magazine } from '@/referral-marketing/magazines/schemas/magazine.schema';
import { ObjectId } from 'mongoose';
import { MagazineDomain } from '@/referral-marketing/magazines/domain/magazine';
import { Customer as CustomerDomain } from '@/customers/customers/domain/customer';
import { ExposeId } from '@/internal/common/interceptors/serialize.interceptor';
import { LeadCoversDto } from '../dto/create-magazine-cover-lead.dto';

export class GeneratedMagazineDomain {
  @Expose()
  @ExposeId()
  id: ObjectId;

  @Expose()
  @Type(() => CustomerDomain)
  customer: CustomerDomain;

  @Expose()
  @Type(() => MagazineDomain)
  magazine: Magazine;

  @Expose()
  url: string;

  @Expose()
  status: string;

  @Expose()
  active: boolean;

  @Expose()
  isPreview: boolean;

  @Expose()
  coverImage: string;

  @Expose()
  flippingBookUrl: string;

  @Expose()
  additionalInformation: string;

  @Expose()
  pageUrl: string;

  @Expose()
  bookUrl: string;

  @Expose()
  pageStatus: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  coversOnlyUrl: string;

  @Expose()
  @Type(() => LeadCoversDto)
  leadCovers: LeadCoversDto;
}

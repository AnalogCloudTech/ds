import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { Segments } from '@/campaigns/email-campaigns/leads/domain/types';

export class OnDemandEmail {
  @Expose()
  id: ObjectId;

  @Expose()
  subject: string;

  @Expose()
  createdAt: Date;

  @Expose()
  scheduleDate: Date;

  @Expose()
  timezone: string;

  @Expose()
  segments: Segments;

  @Expose()
  allSegments: boolean;

  @Expose()
  templateName: string;

  @Expose()
  sendImmediately: boolean;

  @Expose()
  status: string;

  @Expose()
  completionDate: Date;
}

import { Expose, Type } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { CampaignId, CampaignStatus, ContentId, Segments } from './types';

export class Campaign {
  @IsMongoId()
  @Expose()
  id: CampaignId;

  @Expose()
  name: string;

  @Expose()
  allowWeekend: boolean;

  @Expose()
  @Type(() => Date)
  startDate: string;

  @Expose()
  status: CampaignStatus;

  @Expose()
  allSegments: boolean;

  @Expose()
  segments: Segments;

  @Expose()
  @Type(() => Date)
  createdAt: string;

  @Expose()
  contentId: ContentId;
}

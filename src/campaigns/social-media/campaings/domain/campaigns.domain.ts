import { IsMongoId } from 'class-validator';
import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class CampaignDomain {
  @IsMongoId()
  @Expose()
  id: ObjectId;

  @Expose()
  campaignName: string;

  @Expose()
  startDate: Date;

  @Expose()
  status: string;

  @Expose()
  contenId: string;
}

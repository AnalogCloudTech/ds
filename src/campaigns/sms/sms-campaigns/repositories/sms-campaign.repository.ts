import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import {
  SmsCampaign,
  SmsCampaignDocument,
} from '@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema';

@Injectable()
export class SmsCampaignRepository extends GenericRepository<SmsCampaignDocument> {
  constructor(
    @InjectModel(SmsCampaign.name)
    protected readonly model: Model<SmsCampaignDocument>,
  ) {
    super(model);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Campaign,
  CampaignDocument,
} from '@/campaigns/email-campaigns/campaigns/schemas/campaign.schema';
import { Model } from 'mongoose';
import { GenericRepository } from '@/internal/common/repository/generic.repository';

@Injectable()
export class CampaignRepository extends GenericRepository<CampaignDocument> {
  constructor(
    @InjectModel(Campaign.name)
    protected readonly model: Model<CampaignDocument>,
  ) {
    super(model);
  }
}

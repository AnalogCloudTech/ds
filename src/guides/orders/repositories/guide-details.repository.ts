import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { Model } from 'mongoose';
import {
  GuideDetails,
  GuideDetailDocument,
} from '../schemas/guide-details.schema';

@Injectable()
export class GuideDetailsRepository extends GenericRepository<GuideDetailDocument> {
  constructor(
    @InjectModel(GuideDetails.name)
    protected readonly model: Model<GuideDetailDocument>,
  ) {
    super(model);
  }
}

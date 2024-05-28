import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  TrackingPixel,
  TrackingPixelDocument,
} from '../schemas/tracking-pixel.schema';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { Model } from 'mongoose';

@Injectable()
export class TrackingPixelRepository extends GenericRepository<TrackingPixelDocument> {
  constructor(
    @InjectModel(TrackingPixel.name)
    protected readonly model: Model<TrackingPixelDocument>,
  ) {
    super(model);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { TrackingPixelRepository } from './repositories/tracking-pixel.repository';
import {
  TrackingPixel,
  TrackingPixelDocument,
} from './schemas/tracking-pixel.schema';
import { FilterQuery } from 'mongoose';
import { ListTrackingPixelsDTO } from '@/onboard/tracking-pixel/DTO/list-tracking-pixels.dto';

@Injectable()
export class TrackingPixelService {
  constructor(
    private readonly trackingPixelRepository: TrackingPixelRepository,
    private readonly logger: Logger,
  ) {}

  async list(dto: ListTrackingPixelsDTO): Promise<TrackingPixel[] | []> {
    const query: FilterQuery<TrackingPixelDocument> = {
      ...dto,
    };
    const trackingPixels = await this.trackingPixelRepository.findAll(query);
    if (!trackingPixels) {
      return [];
    }
    return trackingPixels;
  }
}

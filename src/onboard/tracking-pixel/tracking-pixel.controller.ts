import { Controller, Get, Query } from '@nestjs/common';
import { TrackingPixelService } from './tracking-pixel.service';
import { TrackingPixel } from './schemas/tracking-pixel.schema';
import { ListTrackingPixelsDTO } from '@/onboard/tracking-pixel/DTO/list-tracking-pixels.dto';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { TrackingPixelDomain } from '@/onboard/tracking-pixel/domain/tracking';
import { Public } from '@/auth/auth.service';

@Controller({ path: 'tracking-pixel', version: '1' })
export class TrackingPixelController {
  constructor(private readonly service: TrackingPixelService) {}

  @Public()
  @Serialize(TrackingPixelDomain)
  @Get('/')
  getTrackingListById(
    @Query(new ValidationTransformPipe()) dto: ListTrackingPixelsDTO,
  ): Promise<TrackingPixel[] | []> {
    return this.service.list(dto);
  }
}

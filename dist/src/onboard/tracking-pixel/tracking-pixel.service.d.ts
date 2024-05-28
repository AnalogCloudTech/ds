import { Logger } from '@nestjs/common';
import { TrackingPixelRepository } from './repositories/tracking-pixel.repository';
import { TrackingPixel } from './schemas/tracking-pixel.schema';
import { ListTrackingPixelsDTO } from '@/onboard/tracking-pixel/DTO/list-tracking-pixels.dto';
export declare class TrackingPixelService {
    private readonly trackingPixelRepository;
    private readonly logger;
    constructor(trackingPixelRepository: TrackingPixelRepository, logger: Logger);
    list(dto: ListTrackingPixelsDTO): Promise<TrackingPixel[] | []>;
}

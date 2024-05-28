import { TrackingPixelService } from './tracking-pixel.service';
import { TrackingPixel } from './schemas/tracking-pixel.schema';
import { ListTrackingPixelsDTO } from '@/onboard/tracking-pixel/DTO/list-tracking-pixels.dto';
export declare class TrackingPixelController {
    private readonly service;
    constructor(service: TrackingPixelService);
    getTrackingListById(dto: ListTrackingPixelsDTO): Promise<TrackingPixel[] | []>;
}

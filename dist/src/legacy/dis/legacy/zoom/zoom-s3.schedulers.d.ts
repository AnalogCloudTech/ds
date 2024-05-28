import { Logger } from '@nestjs/common';
import { ZoomService } from './zoom.service';
export declare class ZoomS3Scheduler {
    private zoomService;
    private logger;
    constructor(zoomService: ZoomService, logger: Logger);
    handleZoomS3Scheduler(): Promise<void>;
    ZoomCloudScheduler(): Promise<void>;
}

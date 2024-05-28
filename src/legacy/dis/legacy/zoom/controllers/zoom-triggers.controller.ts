import { Controller, Post } from '@nestjs/common';
import { ZoomService } from '@/legacy/dis/legacy/zoom/zoom.service';
import { ApiKeyOnly } from '@/auth/auth.service';

@Controller('zoom-triggers')
export class ZoomTriggersController {
  constructor(private readonly zoomService: ZoomService) {}

  @ApiKeyOnly()
  @Post('handle-zoom-s3-scheduler')
  async handleZoomS3Scheduler() {
    return this.zoomService.handleZoomS3Scheduler();
  }

  @ApiKeyOnly()
  @Post('zoom-cloud-scheduler')
  async zoomCloudScheduler() {
    return this.zoomService.ZoomCloudScheduler();
  }
}

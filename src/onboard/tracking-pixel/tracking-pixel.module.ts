import { Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HubspotModule } from '@/legacy/dis/legacy/hubspot/hubspot.module';
import { TrackingPixelController } from './tracking-pixel.controller';
import {
  TrackingPixel,
  TrackingPixelSchema,
} from './schemas/tracking-pixel.schema';
import { TrackingPixelService } from './tracking-pixel.service';
import { TrackingPixelRepository } from './repositories/tracking-pixel.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrackingPixel.name, schema: TrackingPixelSchema },
    ]),
    HubspotModule,
  ],
  providers: [
    Logger,
    ConfigService,
    TrackingPixelService,
    TrackingPixelRepository,
  ],
  controllers: [TrackingPixelController],
  exports: [MongooseModule, TrackingPixelService],
})
export class TrackingPixelModule {}

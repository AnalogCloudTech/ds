import { Module } from '@nestjs/common';
import { GuideOrdersService } from './guide-orders.service';
import { GuideOrdersController } from './guide-orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GuideOrders, GuideOrdersSchema } from './schemas/guide-orders.schema';
import { GuideOrdersRepository } from '@/guides/orders/repositories/guide-orders.repository';
import { HubspotModule } from '@/legacy/dis/legacy/hubspot/hubspot.module';
import { OnboardModule } from '@/onboard/onboard.module';
import { GuideCatalogModule } from '@/guides/catalog/guide-catalog.module';
import { GuideDetailsRepository } from './repositories/guide-details.repository';
import {
  GuideDetails,
  GuideDetailsSchema,
} from './schemas/guide-details.schema';

@Module({
  imports: [
    OnboardModule,
    HubspotModule,
    GuideCatalogModule,
    MongooseModule.forFeature([
      { name: GuideOrders.name, schema: GuideOrdersSchema },
      { name: GuideDetails.name, schema: GuideDetailsSchema },
    ]),
  ],
  providers: [
    GuideOrdersService,
    GuideOrdersRepository,
    GuideDetailsRepository,
  ],
  controllers: [GuideOrdersController],
  exports: [GuideOrdersService, GuideOrdersRepository, GuideDetailsRepository],
})
export class GuideOrdersModule {}

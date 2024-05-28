import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GuideCatalog,
  GuideCatalogSchema,
} from '@/guides/catalog/schemas/guide-catalog.schema';
import { GuideCatalogService } from '@/guides/catalog/guide-catalog.service';
import { GuideCatalogRepository } from '@/guides/catalog/repositories/guide-catalog.repository';
import { GuideCatalogController } from '@/guides/catalog/guide-catalog.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GuideCatalog.name, schema: GuideCatalogSchema },
    ]),
  ],
  providers: [GuideCatalogService, GuideCatalogRepository],
  controllers: [GuideCatalogController],
  exports: [GuideCatalogService, GuideCatalogRepository],
})
export class GuideCatalogModule {}

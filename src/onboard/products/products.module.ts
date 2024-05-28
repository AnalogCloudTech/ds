import { Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductsRepository } from '@/onboard/products/repositories/products.repository';
import { ProductsIntegrationsRepository } from '@/onboard/products/repositories/products-integrations.repository';
import {
  ProductIntegration,
  ProductIntegrationSchema,
} from '@/onboard/products/schemas/product-integrations.schema';
import { HubspotModule } from '@/legacy/dis/legacy/hubspot/hubspot.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductIntegration.name, schema: ProductIntegrationSchema },
    ]),
    HubspotModule,
  ],
  providers: [
    Logger,
    ConfigService,
    ProductsService,
    ProductsRepository,
    ProductsIntegrationsRepository,
  ],
  controllers: [ProductsController],
  exports: [MongooseModule, ProductsService],
})
export class ProductsModule {}

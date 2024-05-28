import { Module, Logger } from '@nestjs/common';
import { CustomerPropertiesService } from './customer-properties.service';

import { CmsModule } from '@/cms/cms/cms.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CustomerProperties,
  CustomerPropertiesSchema,
} from './schemas/customer-properties.schemas';
import { CustomerPropertiesController } from './customer-properties.controller';
import { CustomerPropertiesRepository } from '@/customers/customer-properties/repositories/customer-properties.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomerProperties.name, schema: CustomerPropertiesSchema },
    ]),
    CmsModule,
  ],
  providers: [CustomerPropertiesService, CustomerPropertiesRepository, Logger],
  controllers: [CustomerPropertiesController],
  exports: [CustomerPropertiesService],
})
export class CustomerPropertiesModule {}

import { Module } from '@nestjs/common';
import { CustomerTemplatesService } from './customer-templates.service';
import { CustomerTemplatesController } from './customer-templates.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CustomerTemplate,
  CustomerTemplateSchema,
} from '@/campaigns/email-campaigns/customer-templates/schemas/customer-template.schema';
import { CustomerTemplateRepository } from '@/campaigns/email-campaigns/customer-templates/repositories/customer-template.repository';
import { CmsModule } from '@/cms/cms/cms.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomerTemplate.name, schema: CustomerTemplateSchema },
    ]),
    CmsModule,
  ],
  controllers: [CustomerTemplatesController],
  providers: [CustomerTemplatesService, CustomerTemplateRepository],
  exports: [CustomerTemplatesService],
})
export class CustomerTemplatesModule {}

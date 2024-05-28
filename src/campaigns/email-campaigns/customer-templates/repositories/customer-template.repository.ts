import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CustomerTemplate,
  CustomerTemplateDocument,
} from '@/campaigns/email-campaigns/customer-templates/schemas/customer-template.schema';
import { Model } from 'mongoose';
import { GenericRepository } from '@/internal/common/repository/generic.repository';

@Injectable()
export class CustomerTemplateRepository extends GenericRepository<CustomerTemplateDocument> {
  constructor(
    @InjectModel(CustomerTemplate.name)
    protected readonly model: Model<CustomerTemplateDocument>,
  ) {
    super(model);
  }
}

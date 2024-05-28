import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { CreateCustomerSubscriptionDto } from '@/customers/customers/dto/create-customer-subscription.dto';
import { UnsubscriptionReportDto } from '@/customers/customers/dto/unsubscription-report.dto';
import { UpdateCustomerSubscriptionDto } from '../dto/update-customer-subscription.dto';
import {
  CustomerSubscription,
  CustomerSubscriptionDocument,
} from '../schemas/customer-subscription.schema';
import { SchemaId } from '@/internal/types/helpers';

@Injectable()
export class SubscriptionsRepository extends GenericRepository<CustomerSubscriptionDocument> {
  constructor(
    @InjectModel(CustomerSubscription.name)
    protected readonly model: Model<CustomerSubscriptionDocument>,
  ) {
    super(model);
  }

  async create(
    dto: CreateCustomerSubscriptionDto,
  ): Promise<CustomerSubscriptionDocument> {
    return new this.model(dto).save();
  }

  async updateOne(
    dto: UpdateCustomerSubscriptionDto,
  ): Promise<CustomerSubscriptionDocument> {
    return this.model.findOneAndUpdate(
      { subscriptionId: dto.subscriptionId },
      dto,
      { new: true },
    );
  }

  async upsertSubscription(
    dto: CreateCustomerSubscriptionDto,
  ): Promise<CustomerSubscriptionDocument> {
    const subscriptionExist = await this.model
      .findOne({ subscriptionId: dto?.subscriptionId })
      .exec();
    if (!subscriptionExist) {
      return this.create(dto);
    }
    return this.updateOne(dto);
  }

  async unsubscriptionReport(
    dto: UnsubscriptionReportDto,
  ): Promise<Array<CustomerSubscriptionDocument>> {
    const filter = {
      createdAt: {
        $gte: dto.startDate,
        $lte: dto.endDate,
      },
    };
    return this.model.find(filter).sort({ createdAt: 'desc' }).exec();
  }

  findSubscription(dto: { customerId: SchemaId }) {
    return this.model
      .findOne({ customer: dto.customerId })
      .sort({ createdAt: 'desc' })
      .exec();
  }
}

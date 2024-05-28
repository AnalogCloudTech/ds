import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  GuideOrders,
  GuideOrderDocument,
} from '@/guides/orders/schemas/guide-orders.schema';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { Model } from 'mongoose';
import { CreateGuideOrderDto } from '@/guides/orders/dto/create-guide-order.dto';
import { SchemaId } from '@/internal/types/helpers';
import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';

@Injectable()
export class GuideOrdersRepository extends GenericRepository<
  GuideOrderDocument
> {
  constructor(
    @InjectModel(GuideOrders.name)
    protected readonly model: Model<GuideOrderDocument>,
  ) {
    super(model);
  }

  create(dto: CreateGuideOrderDto, customerId: SchemaId) {
    const params = {
      ...dto,
      customer: customerId,
    };
    return this.model.create(params);
  }

  async count(): Promise<number> {
    return this.model.countDocuments();
  }

  async getLatestOrder(
    customerId: SchemaId,
    guideId: string,
  ): Promise<GuideOrderDocument> {
    const query = {
      $or: [
        {
          customer: customerId,
          guideId,
        },
        {
          customer: customerId,
        },
      ],
    };
    return this.model
      .findOne(query)
      .sort({ createdAt: -1 })
      .exec();
  }

  insertMany(dto: CreateGuideOrderDto[]) {
    return this.model.insertMany(dto);
  }

  async findByCustomerId(
    customerId: SchemaId,
    page: number,
    perPage: number,
  ): Promise<PaginatorSchematicsInterface<GuideOrderDocument>> {
    const skip = page * perPage;
    const query = { customer: customerId };
    const total = await this.model.countDocuments(query).exec();
    const orders = await this.model
      .find(query)
      .skip(skip)
      .limit(perPage)
      .sort({
        createdAt: -1,
      })
      .exec();

    return PaginatorSchema.build<GuideOrderDocument>(
      total,
      orders,
      page,
      perPage,
    );
  }
}

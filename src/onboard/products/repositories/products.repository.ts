import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import { UpdateProductDto } from '../dto/update-products.dto';
import { Product, ProductDocument } from '../schemas/product.schema';
import { CreateProductDto } from '../dto/create-products.dto';
import { Type as ProductType } from '@/onboard/products/domain/types';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product.name)
    private model: Model<ProductDocument>,
  ) {}

  public create(dto: CreateProductDto) {
    return new this.model(dto).save();
  }

  public async findAll(
    page = 0,
    perPage = 25,
    searchQuery = '',
  ): Promise<PaginatorSchematicsInterface<ProductDocument>> {
    const filter: FilterQuery<ProductDocument> = searchQuery
      ? {
          chargifyComponentId: {
            $eq: searchQuery,
          },
        }
      : {};

    const skip = page * perPage;
    const total = await this.model.find().countDocuments().exec();
    const paymentList = await this.model
      .find(filter)
      .skip(skip)
      .limit(perPage)
      .exec();
    return PaginatorSchema.build<ProductDocument>(
      total,
      paymentList,
      page,
      perPage,
    );
  }

  public findOne(id: string) {
    return this.model.findById(id);
  }

  public update(id: string, dto: UpdateProductDto) {
    return this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  public remove(id: string) {
    return this.model.findByIdAndDelete(id).exec();
  }

  public async getProductsNeedToBeSynced(): Promise<Array<ProductDocument>> {
    const filters: FilterQuery<ProductDocument> = {
      chargifyComponentId: { $exists: true },
    };

    return this.model.find(filters).exec();
  }

  public async findProductByChargifyId(
    chargifyComponentId: string,
    type = ProductType.SUBSCRIPTION,
  ): Promise<ProductDocument> {
    return this.model.findOne({
      chargifyComponentId,
      type,
    });
  }

  public async find(
    filter: FilterQuery<ProductDocument>,
    options?: QueryOptions,
  ): Promise<ProductDocument> {
    return this.model.findOne(filter, options).exec();
  }

  public async findProductByStripeId(
    stripeId: string,
  ): Promise<ProductDocument> {
    return this.model.findOne({
      stripeId,
      type: ProductType.SUBSCRIPTION,
    });
  }
}

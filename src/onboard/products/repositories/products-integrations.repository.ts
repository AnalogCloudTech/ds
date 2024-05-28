import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProductIntegration,
  ProductIntegrationDocument,
} from '@/onboard/products/schemas/product-integrations.schema';
import { PaginatorSchema } from '@/internal/utils/paginator';

export type ProductCreateDto = {
  stripeId: string;
  chargifyId: string;
  name: string;
  product: string;
  productProperty: string;
  priceProperty: string;
  value: string;
  credits_once: number;
  credits_recur: number;
  formUrl: string;
  dealPipeline: string;
  dealStage: string;
};

/**
 * @deprecated remove this service after the migration
 */
@Injectable()
export class ProductsIntegrationsRepository {
  constructor(
    @InjectModel(ProductIntegration.name)
    private readonly model: Model<ProductIntegration>,
  ) {}

  async create(product: ProductCreateDto): Promise<ProductIntegrationDocument> {
    return this.model.create(product);
  }

  async findByChargifyId(
    chargifyId: string,
  ): Promise<ProductIntegrationDocument> {
    return this.model.findOne({ chargifyId });
  }

  async findAll(page = 0, perPage = 25) {
    const total = await this.model.find().countDocuments().exec();
    const skip = page * perPage;
    const products = await this.model.find().skip(skip).limit(perPage).exec();

    return PaginatorSchema.build(total, products, page, perPage);
  }
}

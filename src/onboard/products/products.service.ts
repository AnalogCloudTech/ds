import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-products.dto';
import { Product, ProductDocument } from './schemas/product.schema';
import { ProductsRepository } from '@/onboard/products/repositories/products.repository';
import { ProductsIntegrationsRepository } from '@/onboard/products/repositories/products-integrations.repository';
import { ProductIntegrationDocument } from '@/onboard/products/schemas/product-integrations.schema';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { UpdateProductDto } from '@/onboard/products/dto/update-products.dto';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';
import { CONTEXT_PRODUCT_SERVICE } from '@/internal/common/contexts';
import { FilterQuery } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productsIntegrationsRepository: ProductsIntegrationsRepository,
    private readonly logger: Logger,
  ) {}

  create(dto: CreateProductDto): Promise<Product> {
    return this.productsRepository.create(dto);
  }

  getAllProducts(
    page: number,
    perPage: number,
    searchQuery: string,
  ): Promise<PaginatorSchematicsInterface<Product>> {
    return this.productsRepository.findAll(page, perPage, searchQuery);
  }

  async getProductById(id: string): Promise<Product> {
    const product: Product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new HttpException(
        {
          message: 'Product details not found',
          method: 'get',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return product;
  }

  async updateProductById(id: string, dto: UpdateProductDto): Promise<Product> {
    const product: Product = await this.productsRepository.update(id, dto);
    if (!product) {
      throw new HttpException(
        {
          message: 'Product not found',
          method: 'get',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return product;
  }

  async deleteProductById(id: string): Promise<Product> {
    const product: Product = await this.productsRepository.remove(id);
    if (!product) {
      throw new HttpException(
        {
          message: 'Product not found',
          method: 'get',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return product;
  }

  /**
   * @deprecated
   */
  async findIntegrationProductByChargifyId(
    chargifyId: string,
  ): Promise<ProductIntegrationDocument> {
    return this.productsIntegrationsRepository.findByChargifyId(chargifyId);
  }

  async findProductByChargifyId(chargifyId: string): Promise<ProductDocument> {
    return this.productsRepository.findProductByChargifyId(chargifyId);
  }

  async find(query: FilterQuery<ProductDocument>): Promise<ProductDocument> {
    return this.productsRepository.find(query);
  }

  async patchProductsWithIntegrationData() {
    const products = await this.productsRepository.getProductsNeedToBeSynced();
    for (const prod of products) {
      const integrationProduct = await this.findIntegrationProductByChargifyId(
        prod.chargifyComponentId,
      );
      const {
        productProperty,
        priceProperty,
        value,
        credits_once,
        credits_recur,
        book_packages,
        product,
      } = integrationProduct;
      if (integrationProduct) {
        const updatedProduct = await this.productsRepository.update(
          prod._id.toString(),
          {
            productProperty,
            priceProperty,
            creditsOnce: credits_once,
            creditsRecur: credits_recur,
            bookPackages: book_packages,
            product,
            value: Number(value),
          },
        );

        this.logger.log(
          {
            payload: <LoggerPayload>{
              usageDate: DateTime.now(),
              message: `Product ${updatedProduct._id} synced`,
            },
          },
          CONTEXT_PRODUCT_SERVICE,
        );
      } else {
        if (!product) {
          throw new HttpException(
            {
              message: `Product ${prod._id} not synced (integration product not found)`,
            },
            HttpStatus.NOT_FOUND,
          );
        }
      }
    }
  }

  async findAllProducts(page: number, perPage: number) {
    return this.productsIntegrationsRepository.findAll(page, perPage);
  }

  public getProductByStripeId(stripeId: string): Promise<Product> {
    return this.productsRepository.findProductByStripeId(stripeId);
  }
}

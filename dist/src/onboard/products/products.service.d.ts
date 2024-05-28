import { Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-products.dto';
import { Product, ProductDocument } from './schemas/product.schema';
import { ProductsRepository } from '@/onboard/products/repositories/products.repository';
import { ProductsIntegrationsRepository } from '@/onboard/products/repositories/products-integrations.repository';
import { ProductIntegrationDocument } from '@/onboard/products/schemas/product-integrations.schema';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { UpdateProductDto } from '@/onboard/products/dto/update-products.dto';
import { FilterQuery } from 'mongoose';
export declare class ProductsService {
    private readonly productsRepository;
    private readonly productsIntegrationsRepository;
    private readonly logger;
    constructor(productsRepository: ProductsRepository, productsIntegrationsRepository: ProductsIntegrationsRepository, logger: Logger);
    create(dto: CreateProductDto): Promise<Product>;
    getAllProducts(page: number, perPage: number, searchQuery: string): Promise<PaginatorSchematicsInterface<Product>>;
    getProductById(id: string): Promise<Product>;
    updateProductById(id: string, dto: UpdateProductDto): Promise<Product>;
    deleteProductById(id: string): Promise<Product>;
    findIntegrationProductByChargifyId(chargifyId: string): Promise<ProductIntegrationDocument>;
    findProductByChargifyId(chargifyId: string): Promise<ProductDocument>;
    find(query: FilterQuery<ProductDocument>): Promise<ProductDocument>;
    patchProductsWithIntegrationData(): Promise<void>;
    findAllProducts(page: number, perPage: number): Promise<PaginatorSchematicsInterface<import("mongoose").Document<unknown, any, import("@/onboard/products/schemas/product-integrations.schema").ProductIntegration> & import("@/onboard/products/schemas/product-integrations.schema").ProductIntegration & {
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getProductByStripeId(stripeId: string): Promise<Product>;
}

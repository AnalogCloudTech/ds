/// <reference types="mongoose" />
import { Paginator, PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { Product as ProductDomain } from './domain/product';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-products.dto';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-products.dto';
import { ProductSearchtDto } from '@/referral-marketing/magazines/dto/product-search.dto';
export declare class ProductsController {
    private readonly service;
    constructor(service: ProductsService);
    register(body: CreateProductDto): Promise<ProductDomain>;
    getAllProducts({ page, perPage }: Paginator, { searchQuery }: ProductSearchtDto): Promise<PaginatorSchematicsInterface<Product>>;
    getProductById(id: string): Promise<Product>;
    updateProductById(id: string, dto: UpdateProductDto): Promise<Product>;
    deleteProductById(id: string): Promise<Product>;
    findAllProducts({ page, perPage }: Paginator): Promise<PaginatorSchematicsInterface<import("mongoose").Document<unknown, any, import("./schemas/product-integrations.schema").ProductIntegration> & import("./schemas/product-integrations.schema").ProductIntegration & {
        _id: import("mongoose").Types.ObjectId;
    }>>;
}

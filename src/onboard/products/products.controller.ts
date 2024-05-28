import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  Paginator,
  PaginatorSchematicsInterface,
  PaginatorTransformPipe,
} from '@/internal/utils/paginator';
import { Product as ProductDomain } from './domain/product';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-products.dto';
import { ProductsService } from './products.service';
import { IsAdminGuard } from '@/internal/common/guards/is-admin.guard';
import { UpdateProductDto } from './dto/update-products.dto';
import { ProductSearchtDto } from '@/referral-marketing/magazines/dto/product-search.dto';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';

@UseGuards(IsAdminGuard)
@Controller({ path: 'products', version: '1' })
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Post()
  async register(@Body() body: CreateProductDto): Promise<ProductDomain> {
    const result = await this.service.create(body);
    return result.castTo(ProductDomain);
  }

  @Get()
  @UsePipes(ValidationTransformPipe)
  async getAllProducts(
    @Query(PaginatorTransformPipe) { page, perPage }: Paginator,
    @Query() { searchQuery }: ProductSearchtDto,
  ): Promise<PaginatorSchematicsInterface<Product>> {
    return this.service.getAllProducts(page, perPage, searchQuery);
  }

  @Get('/:id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    return this.service.getProductById(id);
  }

  @Patch('/:id')
  async updateProductById(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.service.updateProductById(id, dto);
  }

  @Delete('/:id')
  async deleteProductById(@Param('id') id: string): Promise<Product> {
    return this.service.deleteProductById(id);
  }

  /**
   * @deprecated
   * @param page
   * @param perPage
   */
  @Get('/config/all')
  async findAllProducts(
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
  ) {
    return this.service.findAllProducts(page, perPage);
  }
}

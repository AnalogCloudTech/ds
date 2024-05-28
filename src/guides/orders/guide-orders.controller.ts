import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { GuideOrderDocument } from '@/guides/orders/schemas/guide-orders.schema';
import { GuideOrdersService } from '@/guides/orders/guide-orders.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { GuideOrders } from './domain/guide-orders';
import {
  CreateGuideOrderDto,
  UpdateGuideDto,
} from './dto/create-guide-order.dto';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import { SchemaId } from '@/internal/types/helpers';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { IsAdminGuard } from '@/internal/common/guards/is-admin.guard';
import {
  Paginator,
  PaginatorSchematicsInterface,
  PaginatorTransformPipe,
} from '@/internal/utils/paginator';
import { BookOptionDocument } from '@/onboard/schemas/book-option.schema';
import {
  CreateGuideDataDetailsDto,
  createGuideDetailsSchema,
} from '@/guides/orders/validators/guide-details.validator';
import { ZodValidationPipe } from '@/guides/orders/validators/zod-validation.pipe';
import { GuideDetailsBaseSerializer } from '@/guides/orders/serializers/guide-details.serializer';

@Controller({ path: 'guide-orders', version: '1' })
export class GuideOrdersController {
  constructor(private readonly service: GuideOrdersService) {}

  @UsePipes(ValidationTransformPipe)
  @Post()
  create(
    @Body() dto: CreateGuideOrderDto,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.service.create(dto, customer);
  }

  @UsePipes(ValidationTransformPipe)
  @Post('/multiple-order')
  insertMany(
    @Body('orders') orders: CreateGuideOrderDto[],
    @Body('sessionId') sessionId: string,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.service.insertMany(orders, sessionId, customer);
  }

  @Post('store-onboard-data')
  @SerializeOptions({
    excludeExtraneousValues: true,
    exposeUnsetFields: false,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async storeOnboardData(
    @Param(CustomerPipeByIdentities)
    customer: CustomerDocument,
    @Body(new ZodValidationPipe(createGuideDetailsSchema))
    dto: CreateGuideDataDetailsDto,
  ): Promise<GuideDetailsBaseSerializer> {
    const result = await this.service.storeOnboardData(
      dto,
      customer.email,
      customer._id,
    );
    return new GuideDetailsBaseSerializer(result);
  }

  @Get('get-onboard-data')
  @SerializeOptions({
    excludeExtraneousValues: true,
    exposeUnsetFields: false,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getOnboardData(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ): Promise<GuideDetailsBaseSerializer> {
    const result = await this.service.getOnboardData(customer._id);
    return new GuideDetailsBaseSerializer(result);
  }

  @Get()
  async orders(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
  ): Promise<PaginatorSchematicsInterface<GuideOrderDocument>> {
    return this.service.orders(customer._id, page, perPage);
  }

  @Get('/guide-details')
  async guideDetails(
    @Query('guideId') guideId: string,
  ): Promise<BookOptionDocument> {
    return this.service.guideDetails(guideId);
  }

  @Get('/latest')
  async getLatestOrder(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Query('guideId') guideId: string,
  ): Promise<GuideOrderDocument> {
    return this.service.getLatestOrder(customer._id, guideId);
  }

  @Get(':id')
  async find(@Param('id') id: SchemaId): Promise<GuideOrderDocument> {
    return this.service.find(id);
  }

  @Serialize(GuideOrders)
  @UseGuards(IsAdminGuard)
  @UsePipes(ValidationTransformPipe)
  @Patch(':id')
  update(@Param('id') id: SchemaId, @Body() body: UpdateGuideDto) {
    return this.service.update(id, body);
  }
}

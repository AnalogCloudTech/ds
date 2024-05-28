import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MagazinesService } from '../services/magazines.service';
import { CreateMagazineDto } from '@/referral-marketing/magazines/dto/create-magazine.dto';
import { UpdateMagazineDto } from '@/referral-marketing/magazines/dto/update-magazine.dto';
import { GetAllReportMetricsDto } from '@/referral-marketing/magazines/dto/get-all-report-metrics.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { MagazineDomain } from '@/referral-marketing/magazines/domain/magazine';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { Paginator, PaginatorTransformPipe } from '@/internal/utils/paginator';
import { ReportMagazinesDto } from '../dto/report-magazines';
import { UpdateMagazineStatusDto } from '../dto/update-magazine-status.dto';
import { IsAdmin } from '@/customers/customers/pipes/transform/is-admin.pipe';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import { ListMagazineDto } from '../dto/list-magazine.dto';

@Controller({
  path: 'referral-marketing/magazines',
  version: '1',
})
export class MagazinesController {
  constructor(private readonly magazinesService: MagazinesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @Serialize(MagazineDomain)
  create(
    @Body() dto: CreateMagazineDto,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.magazinesService.create(customer, dto);
  }

  @Get('/pages')
  getMagazineData(
    @Query('month') month: string,
    @Query('year') year: string,
  ): Promise<any> {
    const filters = { month, year };
    return this.magazinesService.getMagazinePages(filters);
  }

  @Get()
  @Serialize(MagazineDomain)
  findAll(
    @Query() list: ListMagazineDto,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.magazinesService.findAll({
      customer,
      ...list,
    });
  }

  @Get('reports/magazine-editing')
  @UsePipes(ValidationTransformPipe)
  async getMagazineEditingMetrics(
    @Query(PaginatorTransformPipe) { page, perPage }: Paginator,
    @Query() { year, month }: ReportMagazinesDto,
  ) {
    return this.magazinesService.getMagazineEditingMetrics(
      page,
      perPage,
      year,
      month,
    );
  }

  @Get('reports/magazine-sent-to-print')
  @UsePipes(ValidationTransformPipe)
  async getMagazineSentToPrintMetrics(
    @Query(PaginatorTransformPipe) { page, perPage }: Paginator,
    @Query() { year, month }: ReportMagazinesDto,
  ) {
    return this.magazinesService.getMagazineSentToPrintMetrics(
      page,
      perPage,
      year,
      month,
    );
  }

  @Get('reports/all')
  async getAllMagazinesMetrics(
    @Query(ValidationPipe) dto: GetAllReportMetricsDto,
  ) {
    return this.magazinesService.getAllMagazinesMetrics(dto);
  }

  @Get(':year/:month')
  @Serialize(MagazineDomain)
  findOne(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.magazinesService.findOne(customer, year, month);
  }

  @UseGuards(IsAdmin)
  @Patch('update-status/:id')
  @Serialize(MagazineDomain)
  async updateMagazineStatus(
    @Param('id') id: string,
    @Body() dto: UpdateMagazineStatusDto,
  ) {
    return this.magazinesService.updateStatusByMagazineId(id, dto);
  }

  @Patch(':year/:month')
  @UsePipes(ValidationTransformPipe)
  @Serialize(MagazineDomain)
  patch(
    @Param('year') year: string,
    @Param('month') month: string,
    @Body() dto: UpdateMagazineDto,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.magazinesService.update(customer, year, month, dto);
  }

  @Get('reports')
  @UsePipes(ValidationTransformPipe)
  async getMagazinesMetrics(@Query() { year, month }: ReportMagazinesDto) {
    return this.magazinesService.getMagazinesMetrics(year, month);
  }

  @Get('metrics/reports/search')
  @UsePipes(ValidationTransformPipe)
  async getMagazinesMetricsBySearch(
    @Query(PaginatorTransformPipe) { page, perPage }: Paginator,
    @Query() { searchQuery, year, month }: ReportMagazinesDto,
  ) {
    return this.magazinesService.getMagazinesMetricsBySearch(
      searchQuery,
      year,
      month,
      page,
      perPage,
    );
  }
}

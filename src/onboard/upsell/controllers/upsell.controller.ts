import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiKeyOnly } from '@/auth/auth.service';
import { SetCustomerPasswordDTO } from '@/onboard/upsell/dto/set-customer-password.dto';
import { MarketingAndSalesParamsDTO } from '@/onboard/upsell/dto/market-and-sales-params.dto';
import { UpsellService } from '@/onboard/upsell/upsell.service';
import { IsAdminGuard } from '@/internal/common/guards/is-admin.guard';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import { Paginator, PaginatorTransformPipe } from '@/internal/utils/paginator';
import {
  ColumnFilterDto,
  FindUpsellReportDto,
  UniqueSearchDto,
  UpsellCSVExportDTO,
} from '@/onboard/upsell/dto/find-upsell-report.dto';
import { SchemaId } from '@/internal/types/helpers';
import {
  CreateUpsellDto,
  createUpsellSchema,
} from '@/onboard/upsell/controllers/validators/create-upsell.validator';
import { ZodValidationPipe } from '@/guides/orders/validators/zod-validation.pipe';

@Controller({
  path: 'upsell',
  version: '1',
})
export class UpsellController {
  constructor(private readonly upsellService: UpsellService) {}

  /*
    Create a new upsell record without session required
   */
  @ApiKeyOnly()
  @Post('create/no-session')
  async create(
    @Body(new ZodValidationPipe(createUpsellSchema)) dto: CreateUpsellDto,
  ) {
    return this.upsellService.create(dto);
  }

  @ApiKeyOnly()
  @Post('customer/set-password')
  async setCustomerPassword(@Body(ValidationPipe) dto: SetCustomerPasswordDTO) {
    return this.upsellService.setCustomerPassword(dto);
  }

  @Post('update-params')
  updateParams(@Body() MarketingAndSalesParams: MarketingAndSalesParamsDTO) {
    return this.upsellService.updateSessionWithParams(MarketingAndSalesParams);
  }

  @UseGuards(IsAdminGuard)
  @Get('find')
  async findAllPaginated(
    @Query(ValidationTransformPipe) dto: FindUpsellReportDto,
    @Query(ValidationTransformPipe) filter: ColumnFilterDto,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
  ) {
    return this.upsellService.findAllPaginated(dto, filter, page, perPage);
  }

  @UseGuards(IsAdminGuard)
  @Post('export')
  async sendCsvToEmail(@Body(ValidationTransformPipe) dto: UpsellCSVExportDTO) {
    return this.upsellService.sendCsvToEmail(dto, dto.filter);
  }

  @UseGuards(IsAdminGuard)
  @Delete()
  async deleteRecord(@Query('id') id: SchemaId) {
    return this.upsellService.deleteRecord(id);
  }

  @UseGuards(IsAdminGuard)
  @Get('advance-search')
  async searchUniqueField(
    @Query(ValidationTransformPipe) dto: UniqueSearchDto,
  ) {
    return this.upsellService.searchUniqueField(dto);
  }
}

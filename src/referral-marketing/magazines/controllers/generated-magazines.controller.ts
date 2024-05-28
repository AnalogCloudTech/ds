import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Paginator, PaginatorTransformPipe } from '@/internal/utils/paginator';
import { GeneratedMagazinesService } from '@/referral-marketing/magazines/services/generated-magazines.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CreateGeneratedMagazineDto } from '@/referral-marketing/magazines/dto/create-generated-magazine.dto';
import { UpdateGeneratedMagazineStatusDto } from '@/referral-marketing/magazines/dto/update-generated-magazine-status.dto';
import { GetAllReportMetricsDto } from '@/referral-marketing/magazines/dto/get-all-report-metrics.dto';
import { ApiKeyOnly } from '@/auth/auth.service';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { GeneratedMagazineDomain } from '@/referral-marketing/magazines/domain/generated-magazine';
import { UpdateGeneratedMagazineDto } from '@/referral-marketing/magazines/dto/update-generated-magazine.dto';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { PreviewMagazineDto } from '../dto/preview-magazine.dto';
import {
  CreateMagazineCoverLeadDto,
  LeadCoversDto,
  LeadDto,
} from '../dto/create-magazine-cover-lead.dto';
import { GeneratedMagazineDocument } from '@/referral-marketing/magazines/schemas/generated-magazine.schema';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';
import { CONTEXT_GENERATED_MAGAZINE } from '@/internal/common/contexts';

@Controller({
  path: 'referral-marketing/generated-magazines',
  version: '1',
})
export class GeneratedMagazinesController {
  constructor(
    private readonly generatedMagazinesService: GeneratedMagazinesService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @Serialize(GeneratedMagazineDomain)
  create(
    @Query('isPreview') isPreview: boolean,
    @Body() dto: CreateGeneratedMagazineDto,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.generatedMagazinesService.create(customer, dto, isPreview);
  }

  @Post('generate-magazine-covers/lead')
  @UsePipes(new ValidationPipe({ transform: true }))
  createMagazineCoverForLead(
    @Body() dto: CreateMagazineCoverLeadDto,
  ): Promise<LeadDto[]> {
    return this.generatedMagazinesService.createMagazineCoverForLeads(dto);
  }

  @Get()
  @Serialize(GeneratedMagazineDomain)
  findAll(@Param(CustomerPipeByIdentities) customer: CustomerDocument) {
    return this.generatedMagazinesService.findAll(customer);
  }

  @Get('reports/all')
  @UsePipes(ValidationTransformPipe)
  async getAllGeneratedMagazinesMetrics(
    @Query(PaginatorTransformPipe) { page, perPage }: Paginator,
    @Query() { year, month, status }: GetAllReportMetricsDto,
  ) {
    return this.generatedMagazinesService.getAllGeneratedMagazinesMetrics(
      page,
      perPage,
      year,
      month,
      status,
    );
  }

  @Get('reports/count-all')
  async getCountAllGeneratedMagazinesMetrics(
    @Query(ValidationPipe) { year, month }: GetAllReportMetricsDto,
  ) {
    return this.generatedMagazinesService.getCountAllGeneratedMagazinesMetrics(
      year,
      month,
    );
  }

  @Get(':year/:month')
  @Serialize(GeneratedMagazineDomain)
  find(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.generatedMagazinesService.findOne(customer, year, month);
  }

  @Patch(':year/:month')
  @UsePipes(new ValidationPipe({ transform: true }))
  @Serialize(GeneratedMagazineDomain)
  update(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Param('year') year: string,
    @Param('month') month: string,
    @Body() dto: UpdateGeneratedMagazineDto,
  ) {
    return this.generatedMagazinesService.update(customer, dto, year, month);
  }

  @Post(':id/print')
  @Serialize(GeneratedMagazineDomain)
  @UsePipes(new ValidationPipe({ transform: true }))
  sendToPrint(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Param('id') id: string,
  ) {
    return this.generatedMagazinesService.sendToPrint(id, customer);
  }

  @ApiKeyOnly()
  @Post(':id/api/print')
  apiSendToPrint(@Param('id') id: string) {
    return this.generatedMagazinesService.sendToPrint(id);
  }

  @ApiKeyOnly()
  @Patch(':id/api/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateGeneratedMagazineStatusDto,
  ) {
    // DON'T REMOVE THIS PIECE OF CODE IS MEANINGFUL FOR TESTING PURPOSES
    this.logger.log(
      {
        payload: <LoggerPayload>{
          usageDate: DateTime.now(),
          data: JSON.stringify(dto),
        },
      },
      CONTEXT_GENERATED_MAGAZINE,
    );

    return this.generatedMagazinesService.updateStatus(id, dto);
  }

  @ApiKeyOnly()
  @Patch(':magazineId')
  updateLeadcoversForMagazine(
    @Param('magazineId') magazineId: string,
    @Body() dto: LeadCoversDto,
  ): Promise<GeneratedMagazineDocument> {
    return this.generatedMagazinesService.updateLeadCoversForMagazine(
      magazineId,
      dto,
    );
  }

  @Get('magazine-preview')
  async getMagazinePreview(@Query(ValidationPipe) dto: PreviewMagazineDto) {
    return this.generatedMagazinesService.getMagazinePreview(dto);
  }

  @Get('generatedMagazine/status/:id')
  @Serialize(GeneratedMagazineDomain)
  getGeneratedMagazineStatusById(
    @Param('id') id: string,
  ): Promise<GeneratedMagazineDocument> {
    return this.generatedMagazinesService.getGeneratedMagazineStatusById(id);
  }
}

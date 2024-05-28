import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { ApiKeyOnly, Public } from '@/auth/auth.service';
import { TransformPasswordEncryptedPipe } from '@/legacy/dis/legacy/hubspot/pipes/transform-password-encrypted.pipe';
import {
  UpdateAfyPasswordAboDto,
  UpdateAfyPasswordDto,
} from '@/legacy/dis/legacy/hubspot/dto/contact.dto';
import { UpsellService } from '@/onboard/upsell/upsell.service';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import {
  ColumnFilterDto,
  FindUpsellReportDto,
  UniqueSearchDto,
} from '@/onboard/upsell/dto/find-upsell-report.dto';
import { Paginator, PaginatorTransformPipe } from '@/internal/utils/paginator';
import { S3Service } from '@/internal/libs/aws/s3/s3.service';
import { CreateUploadDto } from '@/uploads/dto/create-upload.dto';
import { ZoomService } from '@/legacy/dis/legacy/zoom/zoom.service';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
import { OnboardService } from '@/onboard/onboard.service';
import { OfferListReportResponseDto } from '@/onboard/dto/sales-report.dto';
import { CustomersService } from '@/customers/customers/customers.service';
import { Status } from '@/customers/customers/domain/types';
import BooleanTransformPipe from '@/internal/common/pipes/boolean.transform.pipe';
import { MagazinesService } from '@/referral-marketing/magazines/services/magazines.service';
import { ReportMagazinesDto } from '@/referral-marketing/magazines/dto/report-magazines';

@Controller({ path: 'abo', version: '1' })
export class AboController {
  logger = new Logger(AboController.name);

  constructor(
    private readonly hubspotService: HubspotService,
    private readonly upsellService: UpsellService,
    private readonly s3Service: S3Service,
    private readonly zoomService: ZoomService,
    private readonly paymentChargifyService: PaymentChargifyService,
    private readonly onboardService: OnboardService,
    private readonly customersService: CustomersService,
    private readonly magazinesService: MagazinesService,
  ) {}

  @ApiKeyOnly()
  @Post('update-hubspot-password')
  async updateHubspotPassword(
    @Body(ValidationPipe, TransformPasswordEncryptedPipe)
    dto: UpdateAfyPasswordAboDto,
  ) {
    const payload: UpdateAfyPasswordDto = dto;
    payload.passwordConfirmation = dto.password;
    return this.hubspotService.updateAfyPassword(dto);
  }

  @ApiKeyOnly()
  @Get('find-upsell-report')
  async findUpsellReport(
    @Query(ValidationTransformPipe) dto: FindUpsellReportDto,
    @Query(ValidationTransformPipe) filter: ColumnFilterDto,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
  ) {
    return this.upsellService.findAllPaginated(dto, filter, page, perPage);
  }

  @ApiKeyOnly()
  @Get('find-upsell-advanced-search')
  async findUpsellAdvancedSearch(
    @Query(ValidationTransformPipe) dto: UniqueSearchDto,
  ) {
    return this.upsellService.searchUniqueField(dto);
  }

  @ApiKeyOnly()
  @Get('find-upsell-advanced-search-paginated')
  async findUpsellAdvancedSearchPaginated(
    @Query(ValidationTransformPipe) dto: UniqueSearchDto,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
    @Query('isUpsell', BooleanTransformPipe)
    isUpsell: boolean,
  ) {
    return this.upsellService.searchUniqueFieldPaginated(
      dto,
      isUpsell,
      page,
      perPage,
    );
  }

  @ApiKeyOnly()
  @Post('upload-file')
  uploadFile(@Body() createUploadDto: CreateUploadDto) {
    const { path = '', ext, bucket, contentType } = createUploadDto;
    const uploadUrl = this.s3Service.preSignedUpload({
      bucket,
      path,
      ext,
      contentType,
    });
    return { uploadUrl };
  }

  @ApiKeyOnly()
  @Get('screen-recording/get-coaches-list')
  async getCoachesList() {
    return this.zoomService.listAllCoachesWithMeetingCount();
  }

  // This endpoint is being used by offboarding to gather details about customer's subscriptions
  @ApiKeyOnly()
  @Get('payments/subscriptions')
  async getSubscriptionDetails(@Query() { email }: { email: string }) {
    return this.paymentChargifyService.getSubscriptionFromEmailRaw(email);
  }

  // This endpoint is being used by offboarding to gather deal details
  @ApiKeyOnly()
  @Post('hubspot/deal')
  async findDealByEmail(@Body() { email }: { email: string }) {
    // TODO: this function is returning a single deal, but customer can have more than one deal
    return this.hubspotService.getActiveMemberListDeal(email);
  }

  @Public()
  @Get('offersList')
  async getOffersList(
    @Query(PaginatorTransformPipe) { page, perPage }: Paginator,
  ): Promise<OfferListReportResponseDto> {
    return await this.onboardService.getOffersListAbo(page, perPage);
  }

  @ApiKeyOnly()
  @Post('customer/deactivate')
  async customerDeactivate(@Body() { email }: { email: string }) {
    const customer = await this.customersService.findOne({ email });
    if (!customer) {
      throw new Error('missing customer');
    }
    return this.customersService.update(customer, {
      status: Status.INACTIVE,
    });
  }

  @ApiKeyOnly()
  @Get('table-reports')
  getMagazinesMetrics(
    @Query() { year, month }: ReportMagazinesDto,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
  ) {
    return this.magazinesService.getMagazinesMetricsTableData(
      page,
      perPage,
      year,
      month,
    );
  }
}

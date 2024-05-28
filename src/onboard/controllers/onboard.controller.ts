import { IsAdminGuard } from '@/internal/common/guards/is-admin.guard';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request as Req } from 'express';
import { pick } from 'lodash';
import { CreateCustomerDto } from '@/customers/customers/dto/create-customer.dto';
import { Public } from '@/auth/auth.service';
import { Offer } from '../domain/offer';
import {
  MarketingParameters,
  OfferId,
  SalesParameters,
  Step,
} from '../domain/types';
import { CreateOfferDto } from '../dto/create-offer.dto';
import { OfferGuard } from '../guards/offer.guard';
import { SessionGuard } from '../guards/session.guard';
import { OnboardService } from '../onboard.service';
import { OfferPipe } from '../pipes/offer.pipe';
import { OfferDocument } from '../schemas/offer.schema';
import { SessionDocument } from '../schemas/session.schema';
import { Session } from '../domain/session';
import { SessionPipe } from '../pipes/session.pipe';
import { AddonPipe } from '../pipes/addon.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { WebinarDto } from '../dto/webinar.dto';
import { BookOption } from '../domain/book-option';
import { CreateBookOptionDto } from '../dto/create-book-option.dto';
import { BookDetailsDto } from '../dto/book-details.dto';
import { EmailLowerCasePipe } from '@/internal/common/pipes/email-lower-case.pipe';
import { Paginator, PaginatorTransformPipe } from '@/internal/utils/paginator';
import { SalesReportWithDealsResponseDto } from '../dto/sales-with-deals.dto';
import OnBoardMetricsDto from '../pipes/onboardMetricsDto';
import { UnsubscriptionReportDto } from '@/customers/customers/dto/unsubscription-report.dto';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { CustomerSubscription as DomainCustomerSubscription } from '@/customers/customers/domain/customer-subscription';
import { Axios } from 'axios';
import { CmsService } from '@/cms/cms/cms.service';
import {
  ChargifyUpgradePathDto,
  ChargifyUpgradePathResponseDto,
} from '../dto/chargify-upgrade-path.dto';
import { SalesReportResponseDto } from '../dto/sales-report.dto';
import { CalendarDtoWithCoach } from '@/legacy/dis/legacy/calendar/dto/calendar.dto';
import {
  OnBoardMetricsDateRangeDto,
  OnboardMetricsDto,
  SearchSuggestionsDto,
} from '../dto/onboard-metrics.dto';
import { OnboardFilterPipe } from '@/onboard/pipes/onboard-filter.pipe';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import { HubspotCreateDealRequestDto } from '../dto/hubspot-deal-create.dto';
import { CalendarService } from '@/legacy/dis/legacy/calendar/calendar.service';
import { OrderBookAndUpdateSessionDto } from '@/onboard/dto/order-book-and-update-session.dto';
import { SummaryDTO, SummaryGuideDTO } from '@/onboard/dto/summary.dto';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';
import { UpdateScheduledCoachInSessionDto } from '@/onboard/email-reminders/dto/update-scheduled-coach-in-session.dto';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { OnboardSuggestionPipe } from '@/onboard/pipes/onboard-suggestion.pipe';
import { OnboardExceptionsFilter } from '@/onboard/controllers/filters/onboard-exceptions.filter';

@Controller({ path: 'onboard', version: '1' })
export class OnboardController {
  constructor(
    private readonly service: OnboardService,
    private readonly logger: Logger,
    private readonly cmsService: CmsService,
    @Inject('HTTP_DIS') private readonly http: Axios,

    private readonly calendarService: CalendarService,
  ) {}

  @UseGuards(IsAdminGuard)
  @Get('/sessions')
  async getAllSessions(
    @Query(ValidationPipe) { startDate, endDate }: OnBoardMetricsDto,
  ) {
    return this.service.getAllOnboardMetrics(startDate, endDate);
  }

  @Post('login')
  @Public()
  async getToken(
    @Body() { email: username, password }: { email: string; password: string },
  ): Promise<{ token: string }> {
    try {
      const response = await this.http.post<{ data: { token: string } }>(
        '/auth/signin',
        {
          username,
          password,
        },
      );
      const {
        data: { token },
      } = response.data;
      return { token };
    } catch (err) {
      throw new HttpException(
        { message: 'error on customer login', err },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('addon')
  @Public()
  @UseGuards(SessionGuard)
  @UseFilters(OnboardExceptionsFilter)
  async addonOffer(
    @Body('code', AddonPipe) offer: OfferDocument,
    @Body('accepted', ValidationPipe) accepted: boolean,
    @Query('sessionId', SessionPipe) session: SessionDocument,
  ): Promise<Session> {
    const sessionId = <string>session._id;
    if (accepted) {
      const customer = session.customer as CustomerDocument;
      await this.service.startPaymentIntent(customer, offer, session);
      await this.service.syncSucccessfulPaymentWithHubspot(sessionId);
      await this.service.addCustomerToWorkFlow(
        customer,
        offer,
        session.currentStep,
      );
    }
    await this.service.saveAddonAnswer(sessionId, <OfferId>offer.id, accepted);
    return this.service.updateStepAndPopulateSession(session);
  }

  @Get('schedule-coaching')
  @Public()
  @UseGuards(SessionGuard)
  async getScheduleCoachingSlots(
    @Query('sessionId', SessionPipe) session: SessionDocument,
    @Query('offerCode', OfferPipe) offer: OfferDocument,
    @Query('start', ValidationPipe) start: string,
    @Query('outputTimezone') outputTimezone = 'UTC',
  ): Promise<CalendarDtoWithCoach> {
    return this.service.getScheduleCoachingSlots(
      session,
      start,
      outputTimezone,
    );
  }

  @Post('schedule-coaching')
  @Public()
  @UseGuards(SessionGuard)
  @UseFilters(OnboardExceptionsFilter)
  async scheduleCoaching(
    @Query('sessionId', SessionPipe) session: SessionDocument,
    @Query('offerCode', OfferPipe) offer: OfferDocument,
    @Body('start', ValidationPipe) start: string,
    @Body('timezone', ValidationPipe) timezone: string,
  ): Promise<Session> {
    await this.service.scheduleCoaching(session, start, timezone);
    return this.service.updateStepAndPopulateSession(session);
  }

  @Post('session/schedule/coach')
  @Public()
  async updateScheduledCoachInSession(
    @Body()
    dto: UpdateScheduledCoachInSessionDto,
  ) {
    return this.service.updateSessionWithCoach(dto);
  }

  @Patch('schedule-coaching/coach')
  @Public()
  @UseGuards(SessionGuard)
  @UseFilters(OnboardExceptionsFilter)
  async getNewCoach(
    @Query('sessionId', SessionPipe) session: SessionDocument,
  ): Promise<Session> {
    await this.service.findAndAssignCoachToSession(session, true);
    return this.service.updateStepAndPopulateSession(session);
  }

  @Post('offers')
  @UsePipes(ValidationPipe)
  async createOffer(@Body() body: CreateOfferDto): Promise<Offer> {
    const offer = await this.service.createOffer(body);
    return offer.castTo(Offer);
  }

  @Get('offersList')
  @Public()
  async getOffersList() {
    return this.service.getOffersList();
  }

  @Patch('offer/:id')
  @Public()
  async updateOffer(
    @Body() dto: CreateOfferDto,
    @Param('id') id: string,
  ): Promise<any> {
    const offer = await this.service.updateOffer(dto, id);
    return offer;
  }

  @Post('book-options')
  @UsePipes(ValidationPipe)
  async createBookOption(
    @Body() body: CreateBookOptionDto,
  ): Promise<BookOption> {
    const bookOption = await this.service.createBookOption(body);
    return bookOption.castTo(BookOption);
  }

  @Post('session')
  @Public()
  @UseGuards(OfferGuard)
  @UseFilters(OnboardExceptionsFilter)
  async createSession(
    @Request() req: Req,
    @Query('offerCode', OfferPipe) offer: OfferDocument,
  ): Promise<Session> {
    const marketingParameters: MarketingParameters = <MarketingParameters>(
      pick(req.query, [
        'utmSource',
        'utmMedium',
        'utmContent',
        'utmTerm',
        'channel',
        'affiliateId',
      ])
    );
    const salesParameters: SalesParameters = <SalesParameters>(
      pick(req.query, ['orderSystem', 'salesAgent'])
    );
    const session = await this.service.createSession(
      offer,
      marketingParameters,
      salesParameters,
    );
    return this.service.updateStepAndPopulateSession(session);
  }

  @Get('session')
  @Public()
  @UseGuards(SessionGuard)
  @UseFilters(OnboardExceptionsFilter)
  async getSession(
    @Query('sessionId', SessionPipe) session: SessionDocument,
  ): Promise<Session> {
    return this.service.updateStepAndPopulateSession(session);
  }

  @Post('customer')
  @Public()
  @UseGuards(SessionGuard)
  @UseFilters(OnboardExceptionsFilter)
  async createCustomer(
    @Query('sessionId', SessionPipe) session: SessionDocument,
    @Query('offerCode', OfferPipe) offer: OfferDocument,
    @Body(ValidationPipe, EmailLowerCasePipe) body: CreateCustomerDto,
  ): Promise<Session> {
    const boundSession = await this.service.bindCustomerAndStartPaymentIntent(
      body,
      offer,
      session,
    );
    return this.service.updateStepAndPopulateSession(boundSession);
  }

  @Get('step')
  @Public()
  @UseGuards(SessionGuard)
  @UseFilters(OnboardExceptionsFilter)
  async getCurrentStep(
    @Query('sessionId', SessionPipe) session: SessionDocument,
  ): Promise<Step> {
    const refreshed = await this.service.updateStepAndPopulateSession(session);
    return refreshed.step;
  }

  @Post('session/resume')
  @Public()
  @UseGuards(OfferGuard)
  @UseFilters(OnboardExceptionsFilter)
  async resumeSession(
    @Query('offerCode', OfferPipe) offer: OfferDocument,
    @Body('email', ValidationPipe) email: string,
    @Body('password', ValidationPipe) password: string,
  ): Promise<Session> {
    const session = await this.service.resumeSession(
      <OfferId>offer.id,
      email,
      password,
    );
    if (!session) {
      throw new HttpException(null, HttpStatus.NO_CONTENT);
    }
    return this.service.updateStepAndPopulateSession(session);
  }

  @Post('webinar')
  @Public()
  @UseGuards(SessionGuard)
  @UseFilters(OnboardExceptionsFilter)
  async registerForWebinar(
    @Query('sessionId', SessionPipe) session: SessionDocument,
    @Body(ValidationPipe) dto: WebinarDto,
  ): Promise<Session> {
    await this.service.webinarRegistration(
      dto.slot,
      dto.timezone,
      dto.sms,
      session,
    );
    return this.service.updateStepAndPopulateSession(session);
  }

  @Post('book-details')
  @Public()
  @UseGuards(SessionGuard)
  @UseFilters(OnboardExceptionsFilter)
  async bookDetails(
    @Query('sessionId', SessionPipe) session: SessionDocument,
    @Body(ValidationPipe, EmailLowerCasePipe) dto: BookDetailsDto,
  ): Promise<Session> {
    await this.service.saveBookDetailsAndGenerateBook(dto, session);
    return this.service.updateStepAndPopulateSession(session);
  }

  @Get('/sales/:fromDate/:toDate')
  async getSalesWithDeals(
    @Param('fromDate', ValidationPipe) fromDate: string,
    @Param('toDate', ValidationPipe) toDate: string,
  ): Promise<SalesReportWithDealsResponseDto> {
    return this.service.getSalesWithDeals(fromDate, toDate);
  }

  /**
   * @deprecated
   */
  // @Get('/email-reminders/:fromDate/:toDate')
  // async getCoachEmailReminders(
  //   @Param('fromDate', ValidationPipe) fromDate: string,
  //   @Param('toDate', ValidationPipe) toDate: string,
  // ): Promise<CoachEmailReminderResponseDto> {
  //   return this.service.getCoachEmailReminders(fromDate, toDate);
  // }

  @Get('metrics/reports')
  async getOnboardMetrics(
    @Query(ValidationPipe) { startDate, endDate }: OnBoardMetricsDto,
  ) {
    return this.service.getOnboardMetrics(startDate, endDate);
  }

  @Get('metrics/reports/search')
  @UsePipes(ValidationTransformPipe)
  async getOnboardMetricsBySearch(
    @Query(PaginatorTransformPipe) { page, perPage }: Paginator,
    @Query() { searchQuery }: OnBoardMetricsDto,
  ): Promise<SalesReportResponseDto> {
    return this.service.getOnboardMetricsBySearch(
      page,
      perPage,
      searchQuery.replace(' ', '+'),
    );
  }

  @Get('metrics/reports/filter')
  @UsePipes(ValidationTransformPipe)
  async getOnboardMetricsByFilter(
    @Query(PaginatorTransformPipe) { page, perPage }: Paginator,
    @Query() { startDate, endDate }: OnBoardMetricsDateRangeDto,
    @Query(OnboardFilterPipe) filter?: OnboardMetricsDto,
  ): Promise<SalesReportResponseDto> {
    return this.service.getOnboardMetricsByFilter(
      page || 0,
      perPage || 50,
      filter || {},
      startDate,
      endDate,
    );
  }

  @Get('metrics/reports/suggestions')
  @UsePipes(ValidationTransformPipe)
  async getSearchSuggestions(
    @Query(OnboardSuggestionPipe) filter?: SearchSuggestionsDto,
  ): Promise<string[]> {
    return this.service.getSearchSuggestions(filter);
  }

  @Get('metrics/reports/paid-sales')
  @UsePipes(ValidationTransformPipe)
  async getOnboardMetricsByPaidSales(
    @Query(PaginatorTransformPipe) { page, perPage }: Paginator,
    @Query() { startDate, endDate }: OnBoardMetricsDto,
  ): Promise<SalesReportResponseDto> {
    return this.service.getOnboardMetricsByPaidSales(
      page || 0,
      perPage || 50,
      startDate,
      endDate,
    );
  }

  @Get('metrics/reports/unique-visits')
  @UsePipes(ValidationTransformPipe)
  async getOnboardMetricsByUniqueVisits(
    @Query(PaginatorTransformPipe) { page, perPage }: Paginator,
    @Query() { startDate, endDate }: OnBoardMetricsDto,
  ): Promise<SalesReportResponseDto> {
    return this.service.getOnboardMetricsByUniqueVisits(
      page,
      perPage,
      startDate,
      endDate,
    );
  }

  @Get('metrics/reports/books')
  @UsePipes(ValidationTransformPipe)
  async getOnboardMetricsByBooks(
    @Query(PaginatorTransformPipe) { page, perPage }: Paginator,
    @Query() { startDate, endDate }: OnBoardMetricsDto,
  ): Promise<SalesReportResponseDto> {
    return this.service.getOnboardMetricsByBooks(
      page,
      perPage,
      startDate,
      endDate,
    );
  }

  @Get('metrics/reports/auto-login')
  @UsePipes(ValidationTransformPipe)
  async getOnboardMetricsByAutoLogin(
    @Query(PaginatorTransformPipe) { page, perPage }: Paginator,
    @Query() { startDate, endDate }: OnBoardMetricsDto,
  ): Promise<SalesReportResponseDto> {
    return this.service.getOnboardMetricsByAutoLogin(
      page,
      perPage,
      startDate,
      endDate,
    );
  }

  @Get('metrics/reports/cancellations')
  @UsePipes(ValidationTransformPipe)
  async getOnboardMetricsByCancellations(
    @Query(PaginatorTransformPipe) { page, perPage }: Paginator,
    @Query() { startDate, endDate }: OnBoardMetricsDto,
  ): Promise<SalesReportResponseDto> {
    return this.service.getOnboardMetricsByCancellations(
      page,
      perPage,
      startDate,
      endDate,
    );
  }

  @Serialize(DomainCustomerSubscription)
  @Get('customer-unsubscription/report')
  async customerUnsubscriptionReport(
    @Body(ValidationPipe) dto: UnsubscriptionReportDto,
  ) {
    return this.service.customerUnsubscriptionReport(dto);
  }

  @Get('upgradepath')
  async getUpgradePath(
    @Body(ValidationPipe) dto: ChargifyUpgradePathDto,
  ): Promise<ChargifyUpgradePathResponseDto> {
    return this.cmsService.getUpgradePath(dto);
  }

  @Post('update-social-media')
  async updateCustomerSocialMediaTraining(
    @Body(ValidationPipe) dto: { email: string; planName: string },
  ): Promise<any> {
    return this.service.updateCustomerSocialMediaTraining(dto);
  }

  @UseGuards(IsAdminGuard)
  @Post('re-create/hubspot-deal')
  async reCreateHubspotDeal(
    @Body(ValidationPipe) dto: HubspotCreateDealRequestDto,
  ) {
    return this.service.reCreateHubspotDeal(dto);
  }

  @Post('order/book-and-update-session')
  async orderBookAndUpdateSession(
    @Request() req: Req,
    @Body(ValidationPipe) dto: OrderBookAndUpdateSessionDto,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    const jwt = req.headers.authorization;

    try {
      await this.service.logBookOrderWhileTrial(customer, dto);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error({
          payload: <LoggerPayload>{
            usageDate: DateTime.now(),
            method: 'OnboardController@orderBookAndUpdateSession',
            message: 'Error while logging book generation',
            error: error.message,
            stack: error.stack,
            request: <object>req.body,
          },
        });
      }
    }

    return this.service.orderBookAndUpdateSession(dto, jwt);
  }

  @Public()
  @UseGuards(SessionGuard)
  @Get('summary')
  async summary(
    @Request() req: Req,
    @Query('sessionId', SessionPipe) session: SessionDocument,
  ): Promise<SummaryDTO | SummaryGuideDTO> {
    if (!session) {
      this.logger.error({
        payload: <LoggerPayload>{
          usageDate: DateTime.now(),
          method: 'OnboardController@postSummary',
          message: 'Session not found',
          // this next line was inserted to help debuging
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          request: req.body,
        },
      });

      throw new NotFoundException('Session not found');
    }
    return this.service.summary(session);
  }
}

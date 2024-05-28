/// <reference types="mongoose" />
import { Logger } from '@nestjs/common';
import { Request as Req } from 'express';
import { CreateCustomerDto } from '@/customers/customers/dto/create-customer.dto';
import { ContractedOffer, Offer } from './domain/offer';
import { Step } from './domain/types';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OnboardService } from './onboard.service';
import { OfferDocument } from './schemas/offer.schema';
import { SessionDocument } from './schemas/session.schema';
import { Session } from './domain/session';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { WebinarDto } from './dto/webinar.dto';
import { BookOption } from './domain/book-option';
import { CreateBookOptionDto } from './dto/create-book-option.dto';
import { BookDetailsDto } from './dto/book-details.dto';
import { Paginator } from '@/internal/utils/paginator';
import { SalesReportWithDealsResponseDto } from './dto/sales-with-deals.dto';
import OnBoardMetricsDto from './pipes/onboardMetricsDto';
import { UnsubscriptionReportDto } from '@/customers/customers/dto/unsubscription-report.dto';
import { Axios } from 'axios';
import { CmsService } from '@/cms/cms/cms.service';
import { ChargifyUpgradePathDto, ChargifyUpgradePathResponseDto } from './dto/chargify-upgrade-path.dto';
import { SalesReportResponseDto } from './dto/sales-report.dto';
import { CalendarDtoWithCoach } from '@/legacy/dis/legacy/calendar/dto/calendar.dto';
import { OnBoardMetricsDateRangeDto, OnboardMetricsDto } from './dto/onboard-metrics.dto';
import { HubspotCreateDealRequestDto } from './dto/hubspot-deal-create.dto';
import { CalendarService } from '@/legacy/dis/legacy/calendar/calendar.service';
import { OrderBookAndUpdateSessionDto } from '@/onboard/dto/order-book-and-update-session.dto';
import { SummaryDTO, SummaryGuideDTO } from '@/onboard/dto/summary.dto';
import { UpdateScheduledCoachInSessionDto } from '@/onboard/email-reminders/dto/update-scheduled-coach-in-session.dto';
export declare class OnboardController {
    private readonly service;
    private readonly logger;
    private readonly cmsService;
    private readonly http;
    private readonly calendarService;
    constructor(service: OnboardService, logger: Logger, cmsService: CmsService, http: Axios, calendarService: CalendarService);
    getAllSessions({ startDate, endDate }: OnBoardMetricsDto): Promise<import("./schemas/session.schema").Session[]>;
    getToken({ email: username, password }: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
    }>;
    addonOffer(offer: OfferDocument, accepted: boolean, session: SessionDocument): Promise<Session>;
    getScheduleCoachingSlots(session: SessionDocument, offer: OfferDocument, start: string, outputTimezone?: string): Promise<CalendarDtoWithCoach>;
    scheduleCoaching(session: SessionDocument, offer: OfferDocument, start: string, timezone: string): Promise<Session>;
    updateScheduledCoachInSession(dto: UpdateScheduledCoachInSessionDto): Promise<SessionDocument>;
    getNewCoach(session: SessionDocument): Promise<Session>;
    createOffer(body: CreateOfferDto): Promise<Offer>;
    getOffersList(): Promise<(import("mongoose").Document<unknown, any, import("./schemas/offer.schema").Offer> & import("./schemas/offer.schema").Offer & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    updateOffer(dto: CreateOfferDto, id: string): Promise<any>;
    createBookOption(body: CreateBookOptionDto): Promise<BookOption>;
    getContractedOffers(offerCode: string): Promise<ContractedOffer[]>;
    createSession(req: Req, offer: OfferDocument): Promise<Session>;
    getSession(session: SessionDocument): Promise<Session>;
    createCustomer(session: SessionDocument, offer: OfferDocument, body: CreateCustomerDto): Promise<Session>;
    getCurrentStep(session: SessionDocument): Promise<Step>;
    resumeSession(offer: OfferDocument, email: string, password: string): Promise<Session>;
    registerForWebinar(session: SessionDocument, dto: WebinarDto): Promise<Session>;
    bookDetails(session: SessionDocument, dto: BookDetailsDto): Promise<Session>;
    getSalesWithDeals(fromDate: string, toDate: string): Promise<SalesReportWithDealsResponseDto>;
    getOnboardMetrics({ startDate, endDate }: OnBoardMetricsDto): Promise<{
        VisitsCount: number;
        PaidSalesCount: number;
        BookGeneratedCount: number;
        CancellationCount: number;
        AutoLoginCount: number;
    }>;
    getOnboardMetricsBySearch({ page, perPage }: Paginator, { searchQuery }: OnBoardMetricsDto): Promise<SalesReportResponseDto>;
    getOnboardMetricsByFilter({ page, perPage }: Paginator, { startDate, endDate }: OnBoardMetricsDateRangeDto, filter?: OnboardMetricsDto): Promise<SalesReportResponseDto>;
    getOnboardMetricsByPaidSales({ page, perPage }: Paginator, { startDate, endDate }: OnBoardMetricsDto): Promise<SalesReportResponseDto>;
    getOnboardMetricsByUniqueVisits({ page, perPage }: Paginator, { startDate, endDate }: OnBoardMetricsDto): Promise<SalesReportResponseDto>;
    getOnboardMetricsByBooks({ page, perPage }: Paginator, { startDate, endDate }: OnBoardMetricsDto): Promise<SalesReportResponseDto>;
    getOnboardMetricsByAutoLogin({ page, perPage }: Paginator, { startDate, endDate }: OnBoardMetricsDto): Promise<SalesReportResponseDto>;
    getOnboardMetricsByCancellations({ page, perPage }: Paginator, { startDate, endDate }: OnBoardMetricsDto): Promise<SalesReportResponseDto>;
    customerUnsubscriptionReport(dto: UnsubscriptionReportDto): Promise<(import("mongoose").Document<unknown, any, import("../customers/customers/schemas/customer-subscription.schema").CustomerSubscription> & import("../customers/customers/schemas/customer-subscription.schema").CustomerSubscription & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getUpgradePath(dto: ChargifyUpgradePathDto): Promise<ChargifyUpgradePathResponseDto>;
    updateCustomerSocialMediaTraining(dto: {
        email: string;
        planName: string;
    }): Promise<any>;
    reCreateHubspotDeal(dto: HubspotCreateDealRequestDto): Promise<import("@hubspot/api-client/lib/codegen/crm/deals/api").SimplePublicObject>;
    orderBookAndUpdateSession(req: Req, dto: OrderBookAndUpdateSessionDto, customer: CustomerDocument): Promise<{
        session: Session;
        order: object;
    }>;
    summary(req: Req, session: SessionDocument): Promise<SummaryDTO | SummaryGuideDTO>;
}

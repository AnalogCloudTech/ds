"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardController = void 0;
const is_admin_guard_1 = require("../internal/common/guards/is-admin.guard");
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const create_customer_dto_1 = require("../customers/customers/dto/create-customer.dto");
const auth_service_1 = require("../auth/auth.service");
const offer_1 = require("./domain/offer");
const create_offer_dto_1 = require("./dto/create-offer.dto");
const offer_guard_1 = require("./guards/offer.guard");
const session_guard_1 = require("./guards/session.guard");
const onboard_service_1 = require("./onboard.service");
const offer_pipe_1 = require("./pipes/offer.pipe");
const session_pipe_1 = require("./pipes/session.pipe");
const addon_pipe_1 = require("./pipes/addon.pipe");
const webinar_dto_1 = require("./dto/webinar.dto");
const book_option_1 = require("./domain/book-option");
const create_book_option_dto_1 = require("./dto/create-book-option.dto");
const book_details_dto_1 = require("./dto/book-details.dto");
const email_lower_case_pipe_1 = require("../internal/common/pipes/email-lower-case.pipe");
const paginator_1 = require("../internal/utils/paginator");
const onboardMetricsDto_1 = require("./pipes/onboardMetricsDto");
const unsubscription_report_dto_1 = require("../customers/customers/dto/unsubscription-report.dto");
const serialize_interceptor_1 = require("../internal/common/interceptors/serialize.interceptor");
const customer_subscription_1 = require("../customers/customers/domain/customer-subscription");
const axios_1 = require("axios");
const cms_service_1 = require("../cms/cms/cms.service");
const chargify_upgrade_path_dto_1 = require("./dto/chargify-upgrade-path.dto");
const onboard_metrics_dto_1 = require("./dto/onboard-metrics.dto");
const onboard_filter_pipe_1 = require("./pipes/onboard-filter.pipe");
const validation_transform_pipe_1 = require("../internal/common/pipes/validation-transform.pipe");
const hubspot_deal_create_dto_1 = require("./dto/hubspot-deal-create.dto");
const calendar_service_1 = require("../legacy/dis/legacy/calendar/calendar.service");
const order_book_and_update_session_dto_1 = require("./dto/order-book-and-update-session.dto");
const luxon_1 = require("luxon");
const update_scheduled_coach_in_session_dto_1 = require("./email-reminders/dto/update-scheduled-coach-in-session.dto");
const customer_by_identities_pipe_1 = require("../customers/customers/pipes/transform/customer-by-identities.pipe");
const contracted_offer_guard_1 = require("./guards/contracted-offer.guard");
let OnboardController = class OnboardController {
    constructor(service, logger, cmsService, http, calendarService) {
        this.service = service;
        this.logger = logger;
        this.cmsService = cmsService;
        this.http = http;
        this.calendarService = calendarService;
    }
    async getAllSessions({ startDate, endDate }) {
        return this.service.getAllOnboardMetrics(startDate, endDate);
    }
    async getToken({ email: username, password }) {
        try {
            const response = await this.http.post('/auth/signin', {
                username,
                password,
            });
            const { data: { token }, } = response.data;
            return { token };
        }
        catch (err) {
            throw new common_1.HttpException({ message: 'error on customer login', err }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async addonOffer(offer, accepted, session) {
        const sessionId = session._id;
        if (accepted) {
            const customer = session.customer;
            await this.service.startPaymentIntent(customer, offer, session);
            await this.service.syncSucccessfulPaymentWithHubspot(sessionId);
            await this.service.addCustomerToWorkFlow(customer, offer, session.currentStep);
        }
        await this.service.saveAddonAnswer(sessionId, offer.id, accepted);
        return this.service.updateStepAndPopulateSession(session);
    }
    async getScheduleCoachingSlots(session, offer, start, outputTimezone = 'UTC') {
        return this.service.getScheduleCoachingSlots(session, start, outputTimezone);
    }
    async scheduleCoaching(session, offer, start, timezone) {
        await this.service.scheduleCoaching(session, start, timezone);
        return this.service.updateStepAndPopulateSession(session);
    }
    async updateScheduledCoachInSession(dto) {
        return this.service.updateSessionWithCoach(dto);
    }
    async getNewCoach(session) {
        await this.service.findAndAssignCoachToSession(session, true);
        return this.service.updateStepAndPopulateSession(session);
    }
    async createOffer(body) {
        const offer = await this.service.createOffer(body);
        return offer.castTo(offer_1.Offer);
    }
    async getOffersList() {
        return this.service.getOffersList();
    }
    async updateOffer(dto, id) {
        const offer = await this.service.updateOffer(dto, id);
        return offer;
    }
    async createBookOption(body) {
        const bookOption = await this.service.createBookOption(body);
        return bookOption.castTo(book_option_1.BookOption);
    }
    async getContractedOffers(offerCode) {
        return this.service.findContractedOfferByCode(offerCode);
    }
    async createSession(req, offer) {
        const marketingParameters = ((0, lodash_1.pick)(req.query, [
            'utmSource',
            'utmMedium',
            'utmContent',
            'utmTerm',
            'channel',
            'affiliateId',
        ]));
        const salesParameters = ((0, lodash_1.pick)(req.query, ['orderSystem', 'salesAgent']));
        const session = await this.service.createSession(offer, marketingParameters, salesParameters);
        return this.service.updateStepAndPopulateSession(session);
    }
    async getSession(session) {
        return this.service.updateStepAndPopulateSession(session);
    }
    async createCustomer(session, offer, body) {
        const boundSession = await this.service.bindCustomerAndStartPaymentIntent(body, offer, session);
        return this.service.updateStepAndPopulateSession(boundSession);
    }
    async getCurrentStep(session) {
        const refreshed = await this.service.updateStepAndPopulateSession(session);
        return refreshed.step;
    }
    async resumeSession(offer, email, password) {
        const session = await this.service.resumeSession(offer.id, email, password);
        if (!session) {
            throw new common_1.HttpException(null, common_1.HttpStatus.NO_CONTENT);
        }
        return this.service.updateStepAndPopulateSession(session);
    }
    async registerForWebinar(session, dto) {
        await this.service.webinarRegistration(dto.slot, dto.timezone, dto.sms, session);
        return this.service.updateStepAndPopulateSession(session);
    }
    async bookDetails(session, dto) {
        await this.service.saveBookDetailsAndGenerateBook(dto, session);
        return this.service.updateStepAndPopulateSession(session);
    }
    async getSalesWithDeals(fromDate, toDate) {
        return this.service.getSalesWithDeals(fromDate, toDate);
    }
    async getOnboardMetrics({ startDate, endDate }) {
        return this.service.getOnboardMetrics(startDate, endDate);
    }
    async getOnboardMetricsBySearch({ page, perPage }, { searchQuery }) {
        return this.service.getOnboardMetricsBySearch(page, perPage, searchQuery.replace(' ', '+'));
    }
    async getOnboardMetricsByFilter({ page, perPage }, { startDate, endDate }, filter) {
        return this.service.getOnboardMetricsByFilter(page || 0, perPage || 50, filter || {}, startDate, endDate);
    }
    async getOnboardMetricsByPaidSales({ page, perPage }, { startDate, endDate }) {
        return this.service.getOnboardMetricsByPaidSales(page || 0, perPage || 50, startDate, endDate);
    }
    async getOnboardMetricsByUniqueVisits({ page, perPage }, { startDate, endDate }) {
        return this.service.getOnboardMetricsByUniqueVisits(page, perPage, startDate, endDate);
    }
    async getOnboardMetricsByBooks({ page, perPage }, { startDate, endDate }) {
        return this.service.getOnboardMetricsByBooks(page, perPage, startDate, endDate);
    }
    async getOnboardMetricsByAutoLogin({ page, perPage }, { startDate, endDate }) {
        return this.service.getOnboardMetricsByAutoLogin(page, perPage, startDate, endDate);
    }
    async getOnboardMetricsByCancellations({ page, perPage }, { startDate, endDate }) {
        return this.service.getOnboardMetricsByCancellations(page, perPage, startDate, endDate);
    }
    async customerUnsubscriptionReport(dto) {
        return this.service.customerUnsubscriptionReport(dto);
    }
    async getUpgradePath(dto) {
        return this.cmsService.getUpgradePath(dto);
    }
    async updateCustomerSocialMediaTraining(dto) {
        return this.service.updateCustomerSocialMediaTraining(dto);
    }
    async reCreateHubspotDeal(dto) {
        return this.service.reCreateHubspotDeal(dto);
    }
    async orderBookAndUpdateSession(req, dto, customer) {
        const jwt = req.headers.authorization;
        try {
            await this.service.logBookOrderWhileTrial(customer, dto);
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error({
                    payload: {
                        usageDate: luxon_1.DateTime.now(),
                        method: 'OnboardController@orderBookAndUpdateSession',
                        message: 'Error while logging book generation',
                        error: error.message,
                        stack: error.stack,
                        request: req.body,
                    },
                });
            }
        }
        return this.service.orderBookAndUpdateSession(dto, jwt);
    }
    async summary(req, session) {
        if (!session) {
            this.logger.error({
                payload: {
                    usageDate: luxon_1.DateTime.now(),
                    method: 'OnboardController@postSummary',
                    message: 'Session not found',
                    request: req.body,
                },
            });
            throw new common_1.NotFoundException('Session not found');
        }
        return this.service.summary(session);
    }
};
__decorate([
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Get)('/sessions'),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [onboardMetricsDto_1.default]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getAllSessions", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, auth_service_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getToken", null);
__decorate([
    (0, common_1.Post)('addon'),
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __param(0, (0, common_1.Body)('code', addon_pipe_1.AddonPipe)),
    __param(1, (0, common_1.Body)('accepted', common_1.ValidationPipe)),
    __param(2, (0, common_1.Query)('sessionId', session_pipe_1.SessionPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean, Object]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "addonOffer", null);
__decorate([
    (0, common_1.Get)('schedule-coaching'),
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __param(0, (0, common_1.Query)('sessionId', session_pipe_1.SessionPipe)),
    __param(1, (0, common_1.Query)('offerCode', offer_pipe_1.OfferPipe)),
    __param(2, (0, common_1.Query)('start', common_1.ValidationPipe)),
    __param(3, (0, common_1.Query)('outputTimezone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Object]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getScheduleCoachingSlots", null);
__decorate([
    (0, common_1.Post)('schedule-coaching'),
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __param(0, (0, common_1.Query)('sessionId', session_pipe_1.SessionPipe)),
    __param(1, (0, common_1.Query)('offerCode', offer_pipe_1.OfferPipe)),
    __param(2, (0, common_1.Body)('start', common_1.ValidationPipe)),
    __param(3, (0, common_1.Body)('timezone', common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "scheduleCoaching", null);
__decorate([
    (0, common_1.Post)('session/schedule/coach'),
    (0, auth_service_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_scheduled_coach_in_session_dto_1.UpdateScheduledCoachInSessionDto]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "updateScheduledCoachInSession", null);
__decorate([
    (0, common_1.Patch)('schedule-coaching/coach'),
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __param(0, (0, common_1.Query)('sessionId', session_pipe_1.SessionPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getNewCoach", null);
__decorate([
    (0, common_1.Post)('offers'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_offer_dto_1.CreateOfferDto]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "createOffer", null);
__decorate([
    (0, common_1.Get)('offersList'),
    (0, auth_service_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getOffersList", null);
__decorate([
    (0, common_1.Patch)('offer/:id'),
    (0, auth_service_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_offer_dto_1.CreateOfferDto, String]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "updateOffer", null);
__decorate([
    (0, common_1.Post)('book-options'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_book_option_dto_1.CreateBookOptionDto]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "createBookOption", null);
__decorate([
    (0, common_1.Get)('contracted-offers/:offerCode'),
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(contracted_offer_guard_1.ContractedOfferGuard),
    __param(0, (0, common_1.Param)('offerCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getContractedOffers", null);
__decorate([
    (0, common_1.Post)('session'),
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(offer_guard_1.OfferGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('offerCode', offer_pipe_1.OfferPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "createSession", null);
__decorate([
    (0, common_1.Get)('session'),
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __param(0, (0, common_1.Query)('sessionId', session_pipe_1.SessionPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getSession", null);
__decorate([
    (0, common_1.Post)('customer'),
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __param(0, (0, common_1.Query)('sessionId', session_pipe_1.SessionPipe)),
    __param(1, (0, common_1.Query)('offerCode', offer_pipe_1.OfferPipe)),
    __param(2, (0, common_1.Body)(common_1.ValidationPipe, email_lower_case_pipe_1.EmailLowerCasePipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_customer_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "createCustomer", null);
__decorate([
    (0, common_1.Get)('step'),
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __param(0, (0, common_1.Query)('sessionId', session_pipe_1.SessionPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getCurrentStep", null);
__decorate([
    (0, common_1.Post)('session/resume'),
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(offer_guard_1.OfferGuard),
    __param(0, (0, common_1.Query)('offerCode', offer_pipe_1.OfferPipe)),
    __param(1, (0, common_1.Body)('email', common_1.ValidationPipe)),
    __param(2, (0, common_1.Body)('password', common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "resumeSession", null);
__decorate([
    (0, common_1.Post)('webinar'),
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __param(0, (0, common_1.Query)('sessionId', session_pipe_1.SessionPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, webinar_dto_1.WebinarDto]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "registerForWebinar", null);
__decorate([
    (0, common_1.Post)('book-details'),
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __param(0, (0, common_1.Query)('sessionId', session_pipe_1.SessionPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe, email_lower_case_pipe_1.EmailLowerCasePipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, book_details_dto_1.BookDetailsDto]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "bookDetails", null);
__decorate([
    (0, common_1.Get)('/sales/:fromDate/:toDate'),
    __param(0, (0, common_1.Param)('fromDate', common_1.ValidationPipe)),
    __param(1, (0, common_1.Param)('toDate', common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getSalesWithDeals", null);
__decorate([
    (0, common_1.Get)('metrics/reports'),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [onboardMetricsDto_1.default]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getOnboardMetrics", null);
__decorate([
    (0, common_1.Get)('metrics/reports/search'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Query)(paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator,
        onboardMetricsDto_1.default]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getOnboardMetricsBySearch", null);
__decorate([
    (0, common_1.Get)('metrics/reports/filter'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Query)(paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)(onboard_filter_pipe_1.OnboardFilterPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator,
        onboard_metrics_dto_1.OnBoardMetricsDateRangeDto,
        onboard_metrics_dto_1.OnboardMetricsDto]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getOnboardMetricsByFilter", null);
__decorate([
    (0, common_1.Get)('metrics/reports/paid-sales'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Query)(paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator,
        onboardMetricsDto_1.default]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getOnboardMetricsByPaidSales", null);
__decorate([
    (0, common_1.Get)('metrics/reports/unique-visits'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Query)(paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator,
        onboardMetricsDto_1.default]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getOnboardMetricsByUniqueVisits", null);
__decorate([
    (0, common_1.Get)('metrics/reports/books'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Query)(paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator,
        onboardMetricsDto_1.default]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getOnboardMetricsByBooks", null);
__decorate([
    (0, common_1.Get)('metrics/reports/auto-login'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Query)(paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator,
        onboardMetricsDto_1.default]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getOnboardMetricsByAutoLogin", null);
__decorate([
    (0, common_1.Get)('metrics/reports/cancellations'),
    (0, common_1.UsePipes)(validation_transform_pipe_1.ValidationTransformPipe),
    __param(0, (0, common_1.Query)(paginator_1.PaginatorTransformPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paginator_1.Paginator,
        onboardMetricsDto_1.default]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getOnboardMetricsByCancellations", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(customer_subscription_1.CustomerSubscription),
    (0, common_1.Get)('customer-unsubscription/report'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [unsubscription_report_dto_1.UnsubscriptionReportDto]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "customerUnsubscriptionReport", null);
__decorate([
    (0, common_1.Get)('upgradepath'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chargify_upgrade_path_dto_1.ChargifyUpgradePathDto]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "getUpgradePath", null);
__decorate([
    (0, common_1.Post)('update-social-media'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "updateCustomerSocialMediaTraining", null);
__decorate([
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Post)('re-create/hubspot-deal'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hubspot_deal_create_dto_1.HubspotCreateDealRequestDto]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "reCreateHubspotDeal", null);
__decorate([
    (0, auth_service_1.Public)(),
    (0, common_1.Post)('order/book-and-update-session'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, order_book_and_update_session_dto_1.OrderBookAndUpdateSessionDto, Object]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "orderBookAndUpdateSession", null);
__decorate([
    (0, auth_service_1.Public)(),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('sessionId', session_pipe_1.SessionPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OnboardController.prototype, "summary", null);
OnboardController = __decorate([
    (0, common_1.Controller)({ path: 'onboard', version: '1' }),
    __param(3, (0, common_1.Inject)('HTTP_DIS')),
    __metadata("design:paramtypes", [onboard_service_1.OnboardService,
        common_1.Logger,
        cms_service_1.CmsService,
        axios_1.Axios,
        calendar_service_1.CalendarService])
], OnboardController);
exports.OnboardController = OnboardController;
//# sourceMappingURL=onboard.controller.js.map
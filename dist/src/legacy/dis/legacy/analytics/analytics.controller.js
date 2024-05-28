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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const landing_report_dto_1 = require("./dto/landing-report.dto");
const lodash_1 = require("lodash");
const customer_by_identities_pipe_1 = require("../../../../customers/customers/pipes/transform/customer-by-identities.pipe");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getBookStats(startDate = 'now-90d/d', endDate = 'now/d', customer) {
        const emails = await this.analyticsService.getEmailHistory(customer.email);
        return this.analyticsService.getAllStats(startDate, endDate, customer, emails);
    }
    async getBookLeads(email, pageNumber, pageSize = 10) {
        const emails = await this.analyticsService.getEmailHistory(email);
        return this.analyticsService.getBookLeads(emails, pageNumber, pageSize);
    }
    async getBookLeadsCount(email, bookname) {
        return 0;
    }
    async downloadLeads(email, res) {
        const emails = await this.analyticsService.getEmailHistory(email);
        const report = await this.analyticsService.getBookLeadsReport(emails);
        res.type('csv');
        res.send(report);
    }
    async getBookReads(email, bookname) {
        return 0;
    }
    async getBookVisits(email, bookname) {
        return 0;
    }
    async getLandingStats() {
        return [
            {
                name: '',
                value: 0,
                description: '',
            },
        ];
    }
    async getLandingPageReports(filters) {
        return this.analyticsService.getLandingPageReports(filters);
    }
    async landingPageReportsDownload(res) {
        const report = await this.analyticsService.landingPageReportsDownload();
        res.type('csv');
        res.send(report);
    }
    async getEmailCampaignReports(request) {
        const emails = (0, lodash_1.get)(request, ['user', 'identities']);
        return this.analyticsService.getEmailCampaignReports(emails);
    }
    async getOnDemandEmailReports(request) {
        const emails = (0, lodash_1.get)(request, ['user', 'identities']);
        return this.analyticsService.getOnDemandEmailReports(emails);
    }
    async logDetails(logs) {
        return this.analyticsService.addLogs(logs);
    }
};
__decorate([
    (0, common_1.Get)('book'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getBookStats", null);
__decorate([
    (0, common_1.Get)('book/leads'),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Query)('pageNumber')),
    __param(2, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getBookLeads", null);
__decorate([
    (0, common_1.Get)('book/leads/count'),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Query)('bookname')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getBookLeadsCount", null);
__decorate([
    (0, common_1.Get)('book/leads/download'),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "downloadLeads", null);
__decorate([
    (0, common_1.Get)('book/reads'),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Query)('bookname')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getBookReads", null);
__decorate([
    (0, common_1.Get)('book/visits'),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Query)('bookname')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getBookVisits", null);
__decorate([
    (0, common_1.Get)('landing/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getLandingStats", null);
__decorate([
    (0, common_1.Get)('landing/report'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [landing_report_dto_1.LandingReportRequestDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getLandingPageReports", null);
__decorate([
    (0, common_1.Get)('landing/report/download'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "landingPageReportsDownload", null);
__decorate([
    (0, common_1.Get)('email-campaigns'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getEmailCampaignReports", null);
__decorate([
    (0, common_1.Get)('on-demand-email'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getOnDemandEmailReports", null);
__decorate([
    (0, common_1.Post)('log'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "logDetails", null);
AnalyticsController = __decorate([
    (0, common_1.Controller)({ path: 'analytics', version: '1' }),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=analytics.controller.js.map
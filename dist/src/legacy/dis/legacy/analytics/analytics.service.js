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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const json2csv_1 = require("json2csv");
const luxon_1 = require("luxon");
const analytics_constants_1 = require("./analytics.constants");
const api_client_1 = require("@hubspot/api-client");
const lodash_1 = require("lodash");
const contexts_1 = require("../../../../internal/common/contexts");
const leads_service_1 = require("../../../../campaigns/email-campaigns/leads/leads.service");
let AnalyticsService = class AnalyticsService {
    constructor(http, hubspot, logger, leadService) {
        this.http = http;
        this.hubspot = hubspot;
        this.logger = logger;
        this.leadService = leadService;
    }
    async getBookLeadsCount(startDate, endDate, customer) {
        return this.leadService.getLeadCountByEmail(startDate, endDate, customer.email, customer);
    }
    async getAllStats(startDate, endDate, customer, emails) {
        const promises = [];
        promises.push(this.getBookVisits(startDate, endDate, emails).then((value) => ({
            name: 'Landing Page Visits',
            description: 'Total Visits',
            value,
        })));
        promises.push(this.getBookLeadsCount(startDate, endDate, customer).then((value) => ({
            name: 'Landing Page Conversion',
            description: 'Total Leads',
            value,
        })));
        promises.push(this.getBookReads(startDate, endDate, emails).then((value) => ({
            name: 'Digital Book Visits',
            description: 'Total Visits',
            value,
        })));
        return Promise.all(promises);
    }
    async getEmailCampaignReports(emails) {
        var _a, _b, _c;
        const response = await this.http.post(`/${contexts_1.CONTEXT_EMAIL_CAMPAIGNS}*/_search`, analytics_constants_1.AnalyticsConstants.getEmailCampaignStatistics(emails));
        const buckets = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.aggregations) === null || _b === void 0 ? void 0 : _b.emailCampaigns) === null || _c === void 0 ? void 0 : _c.buckets;
        return (0, lodash_1.map)(buckets, (bucket) => {
            var _a;
            return ({
                campaignName: bucket.key,
                sent: ((_a = bucket.sent) === null || _a === void 0 ? void 0 : _a.value) || 0,
            });
        });
    }
    async getOnDemandEmailReports(emails) {
        var _a, _b, _c;
        const response = await this.http.post(`/${contexts_1.CONTEXT_ON_DEMAND_EMAIL}*/_search`, analytics_constants_1.AnalyticsConstants.getOnDemandEmailStatistics(emails));
        const buckets = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.aggregations) === null || _b === void 0 ? void 0 : _b.onDemandEmail) === null || _c === void 0 ? void 0 : _c.buckets;
        return (0, lodash_1.map)(buckets, (bucket) => {
            var _a;
            return ({
                customerEmail: bucket.key,
                sent: ((_a = bucket.sent) === null || _a === void 0 ? void 0 : _a.value) || 0,
            });
        });
    }
    async getEmailHistory(email) {
        const { body: user } = await this.hubspot.apiRequest({
            method: 'GET',
            path: `/contacts/v1/contact/email/${email}/profile`,
        });
        const profiles = (0, lodash_1.get)(user, 'identity-profiles', []);
        const emails = (0, lodash_1.map)(profiles, (profile) => {
            const identities = (0, lodash_1.get)(profile, ['identities'], []);
            const filtered = (0, lodash_1.filter)(identities, (identity) => {
                const type = (0, lodash_1.get)(identity, ['type'], '');
                return type === 'EMAIL';
            });
            const mapped = (0, lodash_1.map)(filtered, (email) => (0, lodash_1.get)(email, ['value'], ''));
            return mapped;
        });
        return (0, lodash_1.flatten)(emails);
    }
    async getBookReads(startDate, endDate, emails, bookName) {
        var _a, _b, _c;
        const request = bookName
            ? analytics_constants_1.AnalyticsConstants.getBookReadsBookName(startDate, endDate, bookName, emails)
            : analytics_constants_1.AnalyticsConstants.getBookReadCountElasticsearchRequest(emails, startDate, endDate);
        const response = await this.http.post('/pagestead-metrics*/_search', request);
        return (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.aggregations) === null || _b === void 0 ? void 0 : _b.types_count) === null || _c === void 0 ? void 0 : _c.value;
    }
    async getBookVisits(startDate, endDate, emails, bookName) {
        var _a, _b, _c;
        const request = bookName
            ? analytics_constants_1.AnalyticsConstants.getLandingPageVisitsBookName(startDate, endDate, bookName, emails)
            : analytics_constants_1.AnalyticsConstants.getBookVisitCountElasticsearchRequest(emails, startDate, endDate);
        const response = await this.http.post('/pagestead-metrics*/_search', request);
        return (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.aggregations) === null || _b === void 0 ? void 0 : _b.types_count) === null || _c === void 0 ? void 0 : _c.value;
    }
    async getBookLeads(emails, pageNumber, pageSize, formatted) {
        var _a, _b, _c, _d, _e;
        const response = await this.http.post('/pagestead-metrics*/_search', analytics_constants_1.AnalyticsConstants.getLeadsElasticsearchRequest(emails, pageNumber, pageSize));
        const hits = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.hits) === null || _b === void 0 ? void 0 : _b.hits;
        const total = (_e = (_d = (_c = response.data) === null || _c === void 0 ? void 0 : _c.hits) === null || _d === void 0 ? void 0 : _d.total) === null || _e === void 0 ? void 0 : _e.value;
        const leadsData = hits.reduce((a, b) => {
            var _a;
            a.push(JSON.parse((_a = b === null || b === void 0 ? void 0 : b.fields) === null || _a === void 0 ? void 0 : _a.message[0]));
            return a;
        }, []);
        const leads = [];
        leadsData.map((d) => {
            let created = '';
            let parsedDate = luxon_1.DateTime.fromISO(d.usageDate);
            if (!parsedDate.isValid) {
                parsedDate = luxon_1.DateTime.fromSQL(d.usageDate);
            }
            if (parsedDate.isValid) {
                if (formatted) {
                    created = parsedDate.setLocale('en-us').toLocaleString();
                }
                else {
                    created = parsedDate.toISODate();
                }
            }
            const lead = {
                firstName: d.leadFirstName || '',
                lastName: d.leadLastName || '',
                email: d.leadEmail || '',
                phone: d.leadPhone,
                created,
            };
            leads.push(lead);
        });
        return { leads, total };
    }
    async getBookLeadsReport(emails) {
        const leads = await this.getBookLeads(emails, 1, 5000, true);
        const fields = [
            { label: 'First name', value: 'firstName' },
            { label: 'Last name', value: 'lastName' },
            { label: 'Email', value: 'email' },
            { label: 'Phone number', value: 'phone' },
            { label: 'Date', value: 'created' },
        ];
        const json2csv = new json2csv_1.Parser({ fields });
        return json2csv.parse(leads.leads);
    }
    async getLandingPageReports(filters) {
        var _a, _b, _c;
        const response = await this.http.post('/pagestead-metrics*/_search', analytics_constants_1.AnalyticsConstants.getLandingPageReportsElasticsearchRequest(filters));
        const landingResponse = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.aggregations) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.buckets;
        return (0, lodash_1.map)(landingResponse, (resp) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return ({
                count: resp === null || resp === void 0 ? void 0 : resp.doc_count,
                email: (_d = (_c = (_b = (_a = resp === null || resp === void 0 ? void 0 : resp.platform) === null || _a === void 0 ? void 0 : _a.hits) === null || _b === void 0 ? void 0 : _b.hits[0]) === null || _c === void 0 ? void 0 : _c._source) === null || _d === void 0 ? void 0 : _d.customerEmail,
                name: (_h = (_g = (_f = (_e = resp === null || resp === void 0 ? void 0 : resp.platform) === null || _e === void 0 ? void 0 : _e.hits) === null || _f === void 0 ? void 0 : _f.hits[0]) === null || _g === void 0 ? void 0 : _g._source) === null || _h === void 0 ? void 0 : _h.customerId,
            });
        });
    }
    async getEmailHistoryByMessageIds(messageIds) {
        const query = analytics_constants_1.AnalyticsConstants.getEmailHistoryStaticsFromMessageIds(messageIds);
        try {
            const { data } = await this.http.post('/email-history-*/_search', query);
            return data;
        }
        catch (err) {
            if (err instanceof Error) {
                const { stack } = err;
                throw new common_1.HttpException({
                    error: err.message,
                    message: 'Unable to fetch data from elasticsearch email-history index',
                    stack,
                }, common_1.HttpStatus.FAILED_DEPENDENCY);
            }
        }
    }
    addLogs(logDetails) {
        this.logger.log({ payload: logDetails }, contexts_1.CONTEXT_GENERAL_ANALYTICS);
        return true;
    }
    async landingPageReportsDownload() {
        const leads = await this.getLandingPageReports({ size: 10000 });
        const fields = [
            { label: 'Full Name', value: 'name' },
            { label: 'Email', value: 'email' },
            { label: 'Count', value: 'count' },
        ];
        const json2csv = new json2csv_1.Parser({ fields: fields });
        return json2csv.parse(leads);
    }
    async clusterHealth() {
        const url = '_cluster/health';
        return this.http.get(url);
    }
};
AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('HTTP_ANALYTICS')),
    __metadata("design:paramtypes", [axios_1.Axios,
        api_client_1.Client,
        common_1.Logger,
        leads_service_1.LeadsService])
], AnalyticsService);
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=analytics.service.js.map
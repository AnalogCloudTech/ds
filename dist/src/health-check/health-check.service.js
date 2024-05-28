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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckService = void 0;
const common_1 = require("@nestjs/common");
const types_1 = require("./domain/types");
const cms_service_1 = require("../cms/cms/cms.service");
const luxon_1 = require("luxon");
const config_1 = require("@nestjs/config");
const generate_book_service_1 = require("../onboard/generate-book/generate-book.service");
const analytics_service_1 = require("../legacy/dis/legacy/analytics/analytics.service");
let HealthCheckService = class HealthCheckService {
    constructor(configService, cmsService, generateBookService, analyticsService) {
        this.configService = configService;
        this.cmsService = cmsService;
        this.generateBookService = generateBookService;
        this.analyticsService = analyticsService;
    }
    selectService(service) {
        return this[service]();
    }
    async systemHealth() {
        const services = await Promise.all([
            this.checkStrapi(),
            this.checkBba(),
            this.checkElasticsearch(),
        ]);
        return {
            name: 'Digital Services',
            services,
            status: services.find((item) => item.status === types_1.HealthStatus.HEALTH_DEAD)
                ? types_1.HealthStatus.HEALTH_DEAD
                : types_1.HealthStatus.HEALTH_ALIVE,
            responseTime: services.reduce((acc, next) => acc + next.responseTime, 0),
        };
    }
    async checkStrapi() {
        const startTime = luxon_1.DateTime.now();
        let status = types_1.HealthStatus.HEALTH_ALIVE;
        try {
            await this.cmsService.healthCheck();
        }
        catch (e) {
            status = types_1.HealthStatus.HEALTH_DEAD;
        }
        const endTime = luxon_1.DateTime.now();
        const responseTime = endTime.diff(startTime).toMillis();
        return {
            name: 'Strapi',
            key: 'strapi',
            status,
            responseTime,
        };
    }
    async checkBba() {
        const startTime = luxon_1.DateTime.now();
        let status = types_1.HealthStatus.HEALTH_ALIVE;
        try {
            await this.generateBookService.healthCheck();
        }
        catch (e) {
            status = types_1.HealthStatus.HEALTH_DEAD;
        }
        const endTime = luxon_1.DateTime.now();
        const responseTime = endTime.diff(startTime).toMillis();
        return {
            name: 'Book Builder Application',
            key: 'bba',
            status: status,
            responseTime,
        };
    }
    async checkElasticsearch() {
        const startTime = luxon_1.DateTime.now();
        let status = types_1.HealthStatus.HEALTH_ALIVE;
        try {
            await this.analyticsService.clusterHealth();
        }
        catch (exception) {
            status = types_1.HealthStatus.HEALTH_DEAD;
        }
        const endTime = luxon_1.DateTime.now();
        const responseTime = endTime.diff(startTime).toMillis();
        return {
            name: 'ElasticSearch',
            key: 'es',
            status: status,
            responseTime,
        };
    }
};
HealthCheckService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        cms_service_1.CmsService,
        generate_book_service_1.GenerateBookService,
        analytics_service_1.AnalyticsService])
], HealthCheckService);
exports.HealthCheckService = HealthCheckService;
//# sourceMappingURL=health-check.service.js.map
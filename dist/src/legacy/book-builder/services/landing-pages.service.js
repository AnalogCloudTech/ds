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
exports.LandingPagesService = void 0;
const customers_service_1 = require("../../../customers/customers/customers.service");
const common_1 = require("@nestjs/common");
const lodash_1 = require("lodash");
const hubspot_service_1 = require("../../dis/legacy/hubspot/hubspot.service");
const landing_pages_repository_1 = require("../repositories/landing-pages.repository");
let LandingPagesService = class LandingPagesService {
    constructor(landingPagesRepository, service, hubspotService) {
        this.landingPagesRepository = landingPagesRepository;
        this.service = service;
        this.hubspotService = hubspotService;
    }
    async saveProfile(id, dto) {
        return this.service.saveLandingPageProfile(id, dto);
    }
    async getLandingPageDetailsByEmail(email) {
        const hubSpotDetails = await this.hubspotService.getContactEmailIds(email);
        const emailVersions = hubSpotDetails.versions;
        let filteredHubSpotDetails = await (0, lodash_1.map)(emailVersions, (result) => result.value);
        filteredHubSpotDetails = await this.service.landingPageDetailsByEmail(filteredHubSpotDetails);
        return filteredHubSpotDetails;
    }
    async findDetailsByEmail(email) {
        const details = await this.landingPagesRepository.findByEmail(email);
        if (!details) {
            throw new common_1.HttpException({
                message: 'Customer landing page details not found',
                method: 'patch',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        return details;
    }
    async createCustomLandingPage(dto) {
        return this.landingPagesRepository.create(dto);
    }
    async updateCustomLandingPage(id, dto) {
        return this.landingPagesRepository.update(id, dto);
    }
    async deleteCustomLandingPage(id) {
        return this.landingPagesRepository.delete(id);
    }
};
LandingPagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [landing_pages_repository_1.LandingPagesRepository,
        customers_service_1.CustomersService,
        hubspot_service_1.HubspotService])
], LandingPagesService);
exports.LandingPagesService = LandingPagesService;
//# sourceMappingURL=landing-pages.service.js.map
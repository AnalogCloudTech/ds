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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const session_repository_1 = require("../repositories/session.repository");
const types_1 = require("../domain/types");
const lodash_1 = require("lodash");
let SessionService = class SessionService {
    constructor(repository) {
        this.repository = repository;
    }
    pushDeclinedCoach(session, coach) {
        const update = {
            $addToSet: {
                declinedCoaches: coach._id,
            },
        };
        return this.repository.update(session._id, update);
    }
    getSessionsToUpdateCustomerLastStepHubspot(filter) {
        return this.repository.getSessionsToUpdateCustomerLastStepHubspot(filter);
    }
    async startSessionForUpSell(offer, currentStep, customer, marketingParameters, salesParameters) {
        const steps = (0, lodash_1.isEmpty)(offer.steps) ? types_1.DefaultSteps : offer.steps;
        return this.repository.store({
            offer: offer._id,
            currentStep,
            steps,
            customer: customer._id,
            marketingParameters,
            salesParameters,
        });
    }
    async findById(id, options) {
        return this.repository.findById(id, options);
    }
    async update(id, update) {
        return this.repository.update(id, update);
    }
    async onboardSalesReport(match = {}, skip = 0, perPage = 15) {
        return this.repository.onboardSalesReport(match, skip, perPage);
    }
    async onboardSalesReportCount(match = {}) {
        return this.repository.onboardSalesReportCount(match);
    }
};
SessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [session_repository_1.SessionRepository])
], SessionService);
exports.SessionService = SessionService;
//# sourceMappingURL=session.service.js.map
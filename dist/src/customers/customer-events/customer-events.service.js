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
exports.CustomerEventsService = void 0;
const common_1 = require("@nestjs/common");
const customer_events_repository_1 = require("./repositories/customer-events.repository");
let CustomerEventsService = class CustomerEventsService {
    constructor(customerEventsRepository) {
        this.customerEventsRepository = customerEventsRepository;
    }
    async createEvent(customer, dto) {
        const { event, metadata } = dto;
        const data = {
            customer: customer._id,
            event: event,
            metadata,
        };
        return this.customerEventsRepository.store(data);
    }
    async getAllFromCustomer(customer, page, perPage) {
        const filter = {
            customer: customer._id,
        };
        const options = {
            skip: page * perPage,
            limit: perPage,
            lean: true,
            sort: { createdAt: 'desc' },
        };
        return this.customerEventsRepository.findAllPaginated(filter, options);
    }
    async getAllByCustomerId(customerId, page, perPage) {
        const filter = {
            customer: { $eq: customerId },
        };
        const options = {
            skip: page * perPage,
            limit: perPage,
            lean: true,
            sort: { createdAt: 'desc' },
        };
        return this.customerEventsRepository.findAllPaginated(filter, options);
    }
};
CustomerEventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_events_repository_1.CustomerEventsRepository])
], CustomerEventsService);
exports.CustomerEventsService = CustomerEventsService;
//# sourceMappingURL=customer-events.service.js.map
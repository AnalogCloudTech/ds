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
exports.PagevisitsService = void 0;
const common_1 = require("@nestjs/common");
const pagevisits_repository_1 = require("./repository/pagevisits.repository");
const customers_service_1 = require("../customers/customers/customers.service");
let PagevisitsService = class PagevisitsService {
    constructor(pagevisitsRepository, customersService) {
        this.pagevisitsRepository = pagevisitsRepository;
        this.customersService = customersService;
    }
    async createVisits(createPageVisitsDto) {
        const data = Object.assign({}, createPageVisitsDto);
        const customer = await this.getCustomerDetails(createPageVisitsDto.customerEmail);
        if (customer) {
            data['customer'] = customer;
        }
        return this.pagevisitsRepository.store(data);
    }
    getCustomerDetails(customerEmail) {
        return this.customersService.findByIdentities([customerEmail]);
    }
};
PagevisitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pagevisits_repository_1.PagevisitsRepository,
        customers_service_1.CustomersService])
], PagevisitsService);
exports.PagevisitsService = PagevisitsService;
//# sourceMappingURL=pagevisits.service.js.map
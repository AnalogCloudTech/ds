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
exports.CustomerPropertiesService = void 0;
const common_1 = require("@nestjs/common");
const customer_properties_repository_1 = require("./repositories/customer-properties.repository");
const customer_property_not_found_exception_1 = require("./Exceptions/customer-property-not-found.exception");
const luxon_1 = require("luxon");
const contexts_1 = require("../../internal/common/contexts");
let CustomerPropertiesService = class CustomerPropertiesService {
    constructor(repository, logger) {
        this.repository = repository;
        this.logger = logger;
    }
    async create(dto, customer) {
        const data = Object.assign(Object.assign({}, dto), { createdBy: customer === null || customer === void 0 ? void 0 : customer._id });
        return this.repository.store(data);
    }
    async findAll(dto) {
        const options = {
            lean: true,
            sort: { module: 'asc', name: 'asc' },
            populate: ['customer'],
        };
        return this.repository.findAll(dto.filter, options);
    }
    async update(id, dto, customer) {
        const findQuery = {
            _id: { $eq: id },
        };
        const prop = await this.repository.first(findQuery);
        if (!prop) {
            throw new customer_property_not_found_exception_1.CustomerPropertyNotFoundException();
        }
        const version = {
            value: prop.value,
            updatedBy: customer._id,
            updatedAt: new Date(),
        };
        const data = Object.assign(Object.assign({}, dto), { updatedBy: customer._id, versions: [version, ...prop.versions] });
        return this.repository.update(prop._id, data);
    }
    async findOne(id) {
        const query = {
            _id: { $eq: id },
        };
        const prop = await this.repository.first(query);
        this.logger.log({
            payload: {
                usageDate: luxon_1.DateTime.now(),
                prop,
            },
        }, contexts_1.CONTEXT_CUSTOMER_PROPERTY_SERVICE);
        if (!prop) {
            throw new customer_property_not_found_exception_1.CustomerPropertyNotFoundException();
        }
        return prop;
    }
    async softDelete(id) {
        return this.repository.update(id, { deletedAt: luxon_1.DateTime.now().toJSDate() });
    }
};
CustomerPropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_properties_repository_1.CustomerPropertiesRepository,
        common_1.Logger])
], CustomerPropertiesService);
exports.CustomerPropertiesService = CustomerPropertiesService;
//# sourceMappingURL=customer-properties.service.js.map
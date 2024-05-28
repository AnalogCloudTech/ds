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
exports.CustomerEventsController = void 0;
const common_1 = require("@nestjs/common");
const customer_events_service_1 = require("./customer-events.service");
const customer_by_identities_pipe_1 = require("../customers/pipes/transform/customer-by-identities.pipe");
const serialize_interceptor_1 = require("../../internal/common/interceptors/serialize.interceptor");
const customer_events_1 = require("./domain/customer-events");
const paginator_1 = require("../../internal/utils/paginator");
const create_customer_event_dto_1 = require("./dto/create-customer-event.dto");
const validation_transform_pipe_1 = require("../../internal/common/pipes/validation-transform.pipe");
let CustomerEventsController = class CustomerEventsController {
    constructor(customerEventsService) {
        this.customerEventsService = customerEventsService;
    }
    create(customer, dto) {
        return this.customerEventsService.createEvent(customer, dto);
    }
    async findAll(customer, { page, perPage }) {
        return this.customerEventsService.getAllFromCustomer(customer, page, perPage);
    }
    async findAllByCustomerId(customerId, { page, perPage }) {
        return this.customerEventsService.getAllByCustomerId(customerId, page, perPage);
    }
};
__decorate([
    (0, serialize_interceptor_1.Serialize)(customer_events_1.CustomerEvents),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_customer_event_dto_1.CreateCustomerEventDto]),
    __metadata("design:returntype", void 0)
], CustomerEventsController.prototype, "create", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(customer_events_1.CustomerEvents),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __param(1, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, paginator_1.Paginator]),
    __metadata("design:returntype", Promise)
], CustomerEventsController.prototype, "findAll", null);
__decorate([
    (0, serialize_interceptor_1.Serialize)(customer_events_1.CustomerEvents),
    (0, common_1.Get)('/:customerId'),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Query)(validation_transform_pipe_1.ValidationTransformPipe, paginator_1.PaginatorTransformPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, paginator_1.Paginator]),
    __metadata("design:returntype", Promise)
], CustomerEventsController.prototype, "findAllByCustomerId", null);
CustomerEventsController = __decorate([
    (0, common_1.Controller)({ path: 'customer-events', version: '1' }),
    __metadata("design:paramtypes", [customer_events_service_1.CustomerEventsService])
], CustomerEventsController);
exports.CustomerEventsController = CustomerEventsController;
//# sourceMappingURL=customer-events.controller.js.map
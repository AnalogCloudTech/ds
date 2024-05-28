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
exports.SegmentsController = void 0;
const common_1 = require("@nestjs/common");
const segments_service_1 = require("./segments.service");
const customer_by_identities_pipe_1 = require("../../../customers/customers/pipes/transform/customer-by-identities.pipe");
const util_1 = require("util");
let SegmentsController = class SegmentsController {
    constructor(service, logger) {
        this.service = service;
        this.logger = logger;
    }
    index(request) {
        const filters = request.query;
        return this.service.list(filters);
    }
    withLeadsCount(request, customer) {
        const filters = request.query;
        return this.service.listWithCustomerLeadsCount(customer, filters);
    }
    async webhook(event) {
        this.logger.log(`Received webhook: ${(0, util_1.inspect)(event)}`);
        return this.service.handleWebhook(event);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SegmentsController.prototype, "index", null);
__decorate([
    (0, common_1.Get)('with-leads-count'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)(customer_by_identities_pipe_1.CustomerPipeByIdentities)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SegmentsController.prototype, "withLeadsCount", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SegmentsController.prototype, "webhook", null);
SegmentsController = __decorate([
    (0, common_1.Controller)({ path: 'email-campaigns/segments', version: '1' }),
    __metadata("design:paramtypes", [segments_service_1.SegmentsService,
        common_1.Logger])
], SegmentsController);
exports.SegmentsController = SegmentsController;
//# sourceMappingURL=segments.controller.js.map
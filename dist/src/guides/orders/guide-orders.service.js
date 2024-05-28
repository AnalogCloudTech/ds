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
exports.GuideOrdersService = void 0;
const common_1 = require("@nestjs/common");
const guide_orders_repository_1 = require("./repositories/guide-orders.repository");
const onboard_service_1 = require("../../onboard/onboard.service");
const session_service_1 = require("../../onboard/services/session.service");
const lodash_1 = require("lodash");
const hubspot_service_1 = require("../../legacy/dis/legacy/hubspot/hubspot.service");
const types_1 = require("../../onboard/domain/types");
const guide_catalog_service_1 = require("../catalog/guide-catalog.service");
const guide_catalog_schema_1 = require("../catalog/schemas/guide-catalog.schema");
let GuideOrdersService = class GuideOrdersService {
    constructor(repository, onboardService, sessionService, hubspotService, guideCatalogService) {
        this.repository = repository;
        this.onboardService = onboardService;
        this.sessionService = sessionService;
        this.hubspotService = hubspotService;
        this.guideCatalogService = guideCatalogService;
    }
    getOrderId(count) {
        const orderId = count.toString().padStart(10, '0');
        return `GUIDE-${orderId}`;
    }
    async create(dto, customer) {
        const hubspotCustomer = await this.hubspotService.getContactDetailsByEmail(customer.email);
        const guideDetails = await this.guideCatalogService.findOne(dto.guideId);
        let multiplier = 1;
        if (!dto.sessionId && guideDetails.type === guide_catalog_schema_1.Type.PACKET) {
            multiplier = 3;
        }
        const currentCredits = Number((0, lodash_1.get)(hubspotCustomer, ['properties', 'afy_book_credits', 'value'], 0));
        if (currentCredits < dto.quantity * multiplier) {
            throw new common_1.HttpException({ message: 'Not enough credits' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const count = await this.repository.count();
        const orderId = this.getOrderId(count);
        const thumbnail = (guideDetails === null || guideDetails === void 0 ? void 0 : guideDetails.thumbnail) || dto.thumbnail;
        const params = Object.assign(Object.assign({}, dto), { orderId,
            thumbnail });
        const result = await this.repository.create(params, customer._id);
        await this.hubspotService.spendCredits(customer.email, dto.quantity * multiplier);
        const email = customer.email;
        await this.hubspotService.createGuideOrderTicket(dto, orderId, email);
        if (dto.sessionId) {
            const session = await this.onboardService.findSession(dto.sessionId);
            if (!session) {
                throw new Error(`Session with id ${dto.sessionId} not found`);
            }
            await this.sessionService.update(session._id, {
                guideOrdered: true,
                currentStep: types_1.Step.YOUR_GUIDE,
                guideOrder: result,
            });
            return await this.onboardService.findSession(dto.sessionId);
        }
        return result;
    }
    async insertMany(dto, sessionId, customer) {
        const hubspotCustomer = await this.hubspotService.getContactDetailsByEmail(customer.email);
        const currentCredits = Number((0, lodash_1.get)(hubspotCustomer, ['properties', 'afy_book_credits', 'value'], 0));
        let totalQuantity = 0;
        const count = await this.repository.count();
        const dataPromise = dto.map(async (item, index) => {
            const orderId = this.getOrderId(count + index);
            totalQuantity += item.quantity;
            const guideDetails = await this.guideCatalogService.findOne(item.guideId);
            const thumbnail = guideDetails === null || guideDetails === void 0 ? void 0 : guideDetails.thumbnail;
            return Object.assign(Object.assign({}, item), { customer: customer._id, orderId,
                thumbnail });
        });
        const params = await Promise.all(dataPromise);
        if (currentCredits < totalQuantity) {
            throw new common_1.HttpException({ message: 'Not enough credits' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const session = await this.onboardService.findSession(sessionId);
        if (!session) {
            throw new Error(`Session with id ${sessionId} not found`);
        }
        const guides = await this.repository.insertMany(params);
        const email = customer.email;
        const tickets = params.map(async (data) => {
            return await this.hubspotService.createGuideOrderTicket(data, data.orderId, email);
        });
        await Promise.all(tickets);
        await this.hubspotService.spendCredits(customer.email, totalQuantity);
        await this.sessionService.update(session._id, {
            guideOrdered: true,
            currentStep: types_1.Step.YOUR_GUIDE,
            guideOrder: guides,
        });
        return await this.onboardService.findSession(sessionId);
    }
    async find(id) {
        return this.repository.findById(id);
    }
    async orders(customerId, page, perPage) {
        return this.repository.findByCustomerId(customerId, page, perPage);
    }
    async guideDetails(guideId) {
        const bookOption = await this.onboardService.getBookOptionByBookId(guideId);
        if (!bookOption) {
            throw new common_1.HttpException({ message: 'GuideOrders not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        return bookOption;
    }
    async getLatestOrder(customerId, guideId) {
        return this.repository.getLatestOrder(customerId, guideId);
    }
    remove(id) {
        return this.repository.delete(id);
    }
    async update(id, dto) {
        return this.repository.update(id, dto);
    }
};
GuideOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [guide_orders_repository_1.GuideOrdersRepository,
        onboard_service_1.OnboardService,
        session_service_1.SessionService,
        hubspot_service_1.HubspotService,
        guide_catalog_service_1.GuideCatalogService])
], GuideOrdersService);
exports.GuideOrdersService = GuideOrdersService;
//# sourceMappingURL=guide-orders.service.js.map
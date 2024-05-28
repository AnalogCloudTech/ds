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
exports.UpsellService = void 0;
const common_1 = require("@nestjs/common");
const session_service_1 = require("../services/session.service");
const hubspot_service_1 = require("../../legacy/dis/legacy/hubspot/hubspot.service");
const bcrypt = require("bcryptjs");
const session_schema_1 = require("../schemas/session.schema");
const upsell_repository_1 = require("./upsell.repository");
const tw_upsell_schema_1 = require("./schemas/tw-upsell.schema");
const bull_1 = require("@nestjs/bull");
const constant_1 = require("./constant");
const upsell_csv_1 = require("./utils/upsell-csv");
let UpsellService = class UpsellService {
    constructor(sessionService, hubspotService, twUpsellRepository, csvSenderQueue) {
        this.sessionService = sessionService;
        this.hubspotService = hubspotService;
        this.twUpsellRepository = twUpsellRepository;
        this.csvSenderQueue = csvSenderQueue;
    }
    async setCustomerPassword(dto) {
        const session = await this.sessionService.findById(dto.sessionId, {
            populate: 'customer',
        });
        const passwordEncrypted = await bcrypt.hash(dto.password, 10);
        const customer = session.customer;
        const hubspotDto = {
            email: customer.email,
            afy_password: dto.password,
            afy_password_encrypted: passwordEncrypted,
        };
        return this.hubspotService.createOrUpdateContact(hubspotDto);
    }
    async updateSessionWithParams(dto) {
        const session = await this.sessionService.findById(dto.sessionId, {
            populate: ['customer', 'offer'],
        });
        const offer = session.offer;
        const customer = session.customer;
        const upsellReport = Object.assign({ customer: customer.toObject(), customerEmail: customer.email, offer: offer.toObject(), offerName: offer === null || offer === void 0 ? void 0 : offer.title, sessionId: dto.sessionId, paymentProvider: tw_upsell_schema_1.PaymentProviders.CHARGIFY, paymentStatus: tw_upsell_schema_1.PaymentStatus.SUCCESS }, dto.marketingParameters);
        await this.twUpsellRepository.store(upsellReport);
        return this.sessionService.update(dto.sessionId, {
            marketingParameters: dto.marketingParameters,
            sessionType: session_schema_1.SessionType.UPSELL,
        });
    }
    async create(dto) {
        return this.twUpsellRepository.store(dto);
    }
    async createMany(dtos) {
        return this.twUpsellRepository.storeMany(dtos);
    }
    async findAllPaginated(dto, filter, page, perPage) {
        const { search, startDate, endDate, sortBy } = dto;
        let regexFilter = {};
        const filterFields = [
            'customerEmail',
            'offerName',
            'channel',
            'utmSource',
            'utmMedium',
            'utmContent',
            'utmTerm',
        ];
        regexFilter = filterFields.reduce((filterFields, field) => {
            const value = filter[field];
            if (value) {
                filter[field] = { $regex: value, $options: 'i' };
            }
            return filter;
        }, {});
        Object.keys(regexFilter).forEach((key) => {
            if (!filterFields.includes(key)) {
                delete regexFilter[key];
            }
        });
        let query = Object.assign(Object.assign({}, regexFilter), { createdAt: { $gte: startDate, $lte: endDate } });
        if (search) {
            query = Object.assign(Object.assign({}, query), { $or: [
                    { offerName: { $regex: search, $options: 'i' } },
                    { customerEmail: { $regex: search, $options: 'i' } },
                    {
                        channel: { $regex: search, $options: 'i' },
                    },
                    {
                        utmSource: { $regex: search, $options: 'i' },
                    },
                    {
                        utmMedium: { $regex: search, $options: 'i' },
                    },
                    {
                        utmContent: { $regex: search, $options: 'i' },
                    },
                    {
                        utmTerm: { $regex: search, $options: 'i' },
                    },
                ] });
        }
        const options = {
            skip: page * perPage,
            limit: perPage,
            sort: sortBy,
            lean: true,
        };
        return this.twUpsellRepository.findAllPaginated(query, options);
    }
    async deleteRecord(id) {
        return this.twUpsellRepository.delete(id);
    }
    async sendCsvToEmail(dto, filter = {}) {
        var _a;
        let data;
        if ((_a = dto === null || dto === void 0 ? void 0 : dto.reportIds) === null || _a === void 0 ? void 0 : _a.length) {
            data = await this.twUpsellRepository.findByIds(dto.reportIds);
        }
        else {
            const paginated = await this.findAllPaginated(dto, filter, 0, 10000);
            data = paginated.data;
        }
        const formattedData = (0, upsell_csv_1.formatUpsellCSV)(data);
        const jobData = {
            formattedData,
            email: dto.email,
        };
        const opts = { removeOnComplete: true, removeOnFail: true };
        await this.csvSenderQueue.add(jobData, opts);
        return jobData;
    }
};
UpsellService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, bull_1.InjectQueue)(constant_1.UPSELL_REPORT_QUEUE)),
    __metadata("design:paramtypes", [session_service_1.SessionService,
        hubspot_service_1.HubspotService,
        upsell_repository_1.TwUpsellRepository, Object])
], UpsellService);
exports.UpsellService = UpsellService;
//# sourceMappingURL=upsell.service.js.map
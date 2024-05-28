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
exports.GeneratedMagazinesService = void 0;
const common_1 = require("@nestjs/common");
const date_1 = require("../../../internal/utils/date");
const generated_magazines_repository_1 = require("../repositories/generated-magazines.repository");
const magazines_service_1 = require("./magazines.service");
const sns_service_1 = require("../../../internal/libs/aws/sns/sns.service");
const config_1 = require("@nestjs/config");
const luxon_1 = require("luxon");
const hubspot_service_1 = require("../../../legacy/dis/legacy/hubspot/hubspot.service");
const generated_magazine_schema_1 = require("../schemas/generated-magazine.schema");
const magazine_schema_1 = require("../schemas/magazine.schema");
const magazines_repository_1 = require("../repositories/magazines.repository");
const customers_service_1 = require("../../../customers/customers/customers.service");
const cms_service_1 = require("../../../cms/cms/cms.service");
let GeneratedMagazinesService = class GeneratedMagazinesService {
    constructor(magazinesService, generatedMagazinesRepository, magazinesRepository, snsService, configService, hubSpotService, cmsService, customerService, logger) {
        this.magazinesService = magazinesService;
        this.generatedMagazinesRepository = generatedMagazinesRepository;
        this.magazinesRepository = magazinesRepository;
        this.snsService = snsService;
        this.configService = configService;
        this.hubSpotService = hubSpotService;
        this.cmsService = cmsService;
        this.customerService = customerService;
        this.logger = logger;
    }
    async find(filter, options) {
        return this.generatedMagazinesRepository.findGM(filter, options);
    }
    async findOneGM(filter, options) {
        return this.generatedMagazinesRepository.findOneGM(filter, options);
    }
    async updateGM(filter, update, options) {
        return this.generatedMagazinesRepository.updateGM(filter, update, options);
    }
    async create(customer, { year, month, createdByAutomation = false }, isPreview = false, createTicket = false) {
        const magazine = await this.magazinesService.findOne(customer, year, month);
        if (!magazine) {
            this.logger.debug(`magazine not found: ${year}-${month}`);
            throw new common_1.HttpException({ message: 'magazine not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        const generatedMagazine = await this.generatedMagazinesRepository.upsert(customer, magazine, isPreview, !!createdByAutomation);
        try {
            const topic = this.configService.get('aws.sns.topics.RM_MAGAZINE_GENERATION');
            await this.snsService.publish({
                generatedMagazine: generatedMagazine,
                isPreview,
                createTicket,
            }, topic);
            this.logger.log({
                payload: {
                    message: 'sent magazine generation request',
                    generatedMagazine,
                    isPreview,
                    usageDate: luxon_1.DateTime.now(),
                },
            });
            return generatedMagazine;
        }
        catch (err) {
            if (err instanceof Error) {
                this.logger.error({
                    payload: {
                        message: 'error while publishing sns message',
                        err: err === null || err === void 0 ? void 0 : err.message,
                        stack: err === null || err === void 0 ? void 0 : err.stack,
                        usageDate: luxon_1.DateTime.now(),
                    },
                });
                throw new common_1.HttpException({
                    message: 'error publishing on SNS',
                    err: err === null || err === void 0 ? void 0 : err.message,
                    stack: err === null || err === void 0 ? void 0 : err.stack,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async createMagazineCoverForLeads(dto) {
        const customer = await this.customerService.findByEmail(dto.customerEmail);
        if (!customer) {
            throw new common_1.HttpException({ message: 'customer not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        const result = await Promise.all(dto.leads.map(async (lead) => this.generateMagazineCoverForLead(lead, dto, customer)));
        return result;
    }
    async generateMagazineCoverForLead(lead, dto, customer) {
        var _a;
        const magazine = await this.magazinesRepository.findOne(dto.year, dto.month, customer._id);
        if (!magazine) {
            throw new common_1.HttpException({ message: 'magazine not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        magazine.customer = customer;
        magazine.baseReplacers[0]['leadName'] = lead === null || lead === void 0 ? void 0 : lead.name;
        magazine.baseReplacers[0]['leadEmail'] = lead === null || lead === void 0 ? void 0 : lead.email;
        magazine.baseReplacers[0]['leadPhoneNumber'] = lead === null || lead === void 0 ? void 0 : lead.phone;
        magazine.baseReplacers[0]['leadAddress'] = lead === null || lead === void 0 ? void 0 : lead.address;
        if (((_a = magazine === null || magazine === void 0 ? void 0 : magazine.covers) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            try {
                const topic = this.configService.get('aws.sns.topics.RM_MAGAZINE_GENERATION_COVERS_FOR_LEAD');
                await this.snsService.publish({
                    magazine,
                    lead,
                }, topic);
                this.logger.log({
                    payload: {
                        message: 'sent magazine covers generation request',
                        magazine,
                        lead,
                        usageDate: luxon_1.DateTime.now(),
                    },
                });
                return lead;
            }
            catch (err) {
                if (err instanceof Error) {
                    this.logger.error({
                        payload: {
                            message: 'error while publishing sns message',
                            err: err === null || err === void 0 ? void 0 : err.message,
                            stack: err === null || err === void 0 ? void 0 : err.stack,
                            usageDate: luxon_1.DateTime.now(),
                        },
                    });
                    throw new common_1.HttpException({
                        message: 'error publishing on SNS',
                        err: err === null || err === void 0 ? void 0 : err.message,
                        stack: err === null || err === void 0 ? void 0 : err.stack,
                    }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        }
    }
    findAll(customer, isActive = true) {
        return this.generatedMagazinesRepository.find(customer, isActive);
    }
    async findOne(customer, year, month) {
        const magazine = await this.magazinesService.findOne(customer, year, month);
        if (!magazine) {
            throw new common_1.HttpException({ message: 'magazine not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        return this.generatedMagazinesRepository.findOne(customer, magazine);
    }
    async update(customer, { flippingBookUrl, pageUrl, bookUrl, additionalInformation, }, year, month) {
        const magazine = await this.magazinesService.findOne(customer, year, month);
        if (!magazine) {
            throw new common_1.HttpException({ message: 'magazine not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        return this.generatedMagazinesRepository.update(customer, {
            flippingBookUrl,
            pageUrl,
            bookUrl,
            additionalInformation,
        }, magazine);
    }
    updateLeadCoversForMagazine(generatedMagazineId, dto) {
        return this.generatedMagazinesRepository.updateLeadCoversById(generatedMagazineId, dto);
    }
    updateStatus(generatedMagazineId, dto) {
        return this.generatedMagazinesRepository.updateById(generatedMagazineId, dto);
    }
    async getGeneratedMagazineStatusById(generatedMagazineId) {
        return this.generatedMagazinesRepository.findByMagazineId(generatedMagazineId);
    }
    async sendToPrint(generatedMagazineId, _customer) {
        var _a, _b;
        const { status, coversOnlyUrl, magazine, additionalInformation, customer, pageUrl, } = await this.generatedMagazinesRepository.findById(generatedMagazineId, _customer);
        if (coversOnlyUrl && status !== generated_magazine_schema_1.GenerationStatus.DONE) {
            throw new common_1.HttpException({
                message: `magazine status is ${status} it should be DONE to be printed`,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const { _id: magazineId, month: magazineMonth } = (magazine);
        const { email } = customer;
        const ticket = await this.hubSpotService.createPrintQueueTicket({
            email,
            coverUrl: coversOnlyUrl,
            magazineMonth,
            additionalInformation,
            rmProofLink: (_a = _customer.flippingBookPreferences.publicationUrl) !== null && _a !== void 0 ? _a : '',
            rmMemberSiteLink: pageUrl !== null && pageUrl !== void 0 ? pageUrl : '',
            rmShippedMagazineLink: (_b = _customer.flippingBookPreferences.permanentPublicationUrl) !== null && _b !== void 0 ? _b : '',
        });
        if (!ticket.ticketId) {
            throw new common_1.HttpException({ message: 'error creating ticket' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        await this.magazinesRepository.update(magazineId, {
            status: magazine_schema_1.MagazineStatus.SENT_FOR_PRINTING,
        });
        this.logger.log({
            ticket,
            magazineId,
            email,
            coversOnlyUrl,
            magazineMonth,
            usageDate: luxon_1.DateTime.now(),
        });
        return this.generatedMagazinesRepository.updateById(generatedMagazineId, {
            status: generated_magazine_schema_1.GenerationStatus.SENT_FOR_PRINTING,
        });
    }
    async getMagazinePreview(dto) {
        return this.generatedMagazinesRepository.getMagazinePreview(dto);
    }
    async count(magazineIds) {
        return this.generatedMagazinesRepository.count(magazineIds);
    }
    async getAllGeneratedMagazinesMetrics(page, perPage, year, month) {
        let filterQuery;
        const monthNumber = date_1.MonthsNumber[month];
        const yearNumber = +year;
        const startDate = luxon_1.DateTime.fromObject({
            year: yearNumber,
            month: monthNumber,
        });
        const endDate = startDate.endOf('month');
        if (year && month) {
            filterQuery = {
                createdAt: { $gte: startDate, $lte: endDate },
            };
        }
        const skip = page * perPage;
        return this.generatedMagazinesRepository.getAllGeneratedMagazinesMetrics(page, perPage, skip, filterQuery);
    }
    async getCountAllGeneratedMagazinesMetrics(year, month) {
        let filterQuery;
        const monthNumber = date_1.MonthsNumber[month];
        const yearNumber = +year;
        const startDate = luxon_1.DateTime.fromObject({
            year: yearNumber,
            month: monthNumber,
        });
        const endDate = startDate.endOf('month');
        if (year && month) {
            filterQuery = {
                createdAt: { $gte: startDate, $lte: endDate },
            };
        }
        return this.generatedMagazinesRepository.getCountAllGeneratedMagazinesMetrics(filterQuery);
    }
};
GeneratedMagazinesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => magazines_service_1.MagazinesService))),
    __param(8, (0, common_1.Inject)('logger')),
    __metadata("design:paramtypes", [magazines_service_1.MagazinesService,
        generated_magazines_repository_1.GeneratedMagazinesRepository,
        magazines_repository_1.MagazinesRepository,
        sns_service_1.SnsService,
        config_1.ConfigService,
        hubspot_service_1.HubspotService,
        cms_service_1.CmsService,
        customers_service_1.CustomersService,
        common_1.Logger])
], GeneratedMagazinesService);
exports.GeneratedMagazinesService = GeneratedMagazinesService;
//# sourceMappingURL=generated-magazines.service.js.map
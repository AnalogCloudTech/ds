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
exports.ReferralMarketingAdminsService = void 0;
const common_1 = require("@nestjs/common");
const generated_magazines_service_1 = require("./generated-magazines.service");
const magazines_service_1 = require("./magazines.service");
const customers_service_1 = require("../../../customers/customers/customers.service");
const cms_service_1 = require("../../../cms/cms/cms.service");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../constants");
const magazine_schema_1 = require("../schemas/magazine.schema");
const generated_magazines_repository_1 = require("../repositories/generated-magazines.repository");
const hubspot_service_1 = require("../../../legacy/dis/legacy/hubspot/hubspot.service");
const magazines_repository_1 = require("../repositories/magazines.repository");
let ReferralMarketingAdminsService = class ReferralMarketingAdminsService {
    constructor(generatedMagazinesService, magazinesService, customersService, hubSpotService, generatedMagazinesRepository, magazinesRepository, cmsService, logger, magazineQueue, permanentLinkQueue) {
        this.generatedMagazinesService = generatedMagazinesService;
        this.magazinesService = magazinesService;
        this.customersService = customersService;
        this.hubSpotService = hubSpotService;
        this.generatedMagazinesRepository = generatedMagazinesRepository;
        this.magazinesRepository = magazinesRepository;
        this.cmsService = cmsService;
        this.logger = logger;
        this.magazineQueue = magazineQueue;
        this.permanentLinkQueue = permanentLinkQueue;
    }
    async generateMagazine(dto, createTicket = false, isPreview = false, customerEmail, customerId) {
        const customerQuery = {
            $or: [{ email: customerEmail }, { _id: customerId }],
        };
        const customer = await this.customersService.findOne(customerQuery);
        if (!customer) {
            throw new common_1.HttpException({ message: 'customer not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        const magazine = await this.magazinesService.findOne(customer, dto.year, dto.month);
        if (!magazine) {
            throw new common_1.HttpException({ message: 'magazine not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        const magazineInfo = await this.cmsService.magazineDetails(magazine.magazineId);
        const { selections } = magazine;
        const baseReplacers = await this.magazinesService.getBaseReplacers(magazine._id, customer._id);
        const covers = await Promise.all(selections.map(async (selection) => this.magazinesService.processCover(selection, magazineInfo)));
        await this.magazinesService.updateMag(magazine._id, {
            covers,
            baseReplacers,
            contentUrl: magazineInfo.attributes.pdf.data.attributes.url,
        }, { new: true });
        await this.generatedMagazinesService.updateGM({ customer, magazine, active: true }, { active: false }, { new: true });
        return this.generatedMagazinesService.create(customer, dto, isPreview, createTicket);
    }
    async uploadCustomCover(dto) {
        const { userEmail, month, year, coversURL, magazineURL } = dto;
        const customer = await this.customersService.findByEmail(userEmail);
        if (!customer) {
            throw new common_1.HttpException({ message: 'customer not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        const magazine = await this.magazinesService.first({
            customer: customer._id,
            month,
            year,
        });
        if (!magazine) {
            throw new common_1.HttpException({ message: 'magazine not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        const generatedMagazines = await this.generatedMagazinesService.find({
            customer: customer._id,
            magazine: magazine._id,
            active: true,
        });
        const generatedMagazine = generatedMagazines.pop();
        if (!generatedMagazine) {
            throw new common_1.HttpException({
                message: 'customer does not have a generated magazine to be overridden',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        return this.generatedMagazinesService.updateGM({ _id: generatedMagazine._id }, { coversOnlyUrl: coversURL, url: magazineURL }, { new: true });
    }
    async getGeneratedMagazine(customerId, year, month) {
        const customer = await this.customersService.findById(customerId);
        const magazine = await this.magazinesService.findOne(customer, year, month);
        if (!magazine) {
            throw new common_1.HttpException({ message: 'magazine not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        return this.generatedMagazinesRepository.findOne(customer, magazine);
    }
    async getMagazine(customerId, year, month) {
        const customer = await this.customersService.findById(customerId);
        if (!customer) {
            throw new common_1.HttpException({ message: 'customer not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        const magazine = await this.magazinesService.findOne(customer, year, month);
        if (!magazine) {
            throw new common_1.HttpException({ message: 'magazine not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        return magazine;
    }
    async updateMagazine(customerId, year, month, dto) {
        const customer = await this.customersService.findById(customerId);
        if (!customer) {
            throw new common_1.HttpException({ message: 'customer not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        return this.magazinesService.update(customer, year, month, dto);
    }
    async createTicket(generatedMagazineId, customerId, adminUser) {
        var _a, _b;
        const customer = await this.customersService.findById(customerId);
        const admin = await this.customersService.findById(adminUser._id);
        if (!customer) {
            throw new common_1.HttpException({ message: 'customer not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        const generatedMagazine = await this.generatedMagazinesRepository.findById(generatedMagazineId, customer);
        const { coversOnlyUrl, magazine, additionalInformation, customer: customerData, pageUrl, } = generatedMagazine;
        const { month: magazineMonth } = magazine;
        const { email } = customerData;
        const { firstName, lastName } = admin;
        const adminFullName = `${firstName} ${lastName}`;
        const ticket = await this.hubSpotService.createPrintQueueTicket({
            email,
            coverUrl: coversOnlyUrl,
            magazineMonth,
            additionalInformation,
            rmProofLink: (_a = customer.flippingBookPreferences.publicationUrl) !== null && _a !== void 0 ? _a : '',
            rmMemberSiteLink: pageUrl !== null && pageUrl !== void 0 ? pageUrl : '',
            rmShippedMagazineLink: (_b = customer.flippingBookPreferences.permanentPublicationUrl) !== null && _b !== void 0 ? _b : '',
            adminFullName,
        });
        if (!ticket.ticketId) {
            throw new common_1.HttpException({ message: 'error creating ticket' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return generatedMagazine;
    }
    async scheduleMonthlyTurnOver(dto) {
        try {
            const magazinesMap = await this.magazinesService.getMagazineCustomerWithoutMagazine(dto);
            const jobs = magazinesMap.map((data) => {
                return {
                    data: Object.assign(Object.assign({}, data), { month: dto.currentData.month, year: dto.currentData.year }),
                    opts: {
                        removeOnComplete: true,
                    },
                };
            });
            await this.magazineQueue.addBulk(jobs);
            return {
                message: 'jobs scheduled',
                jobs: jobs.length,
            };
        }
        catch (err) {
            this.logger.error(err);
            throw new common_1.HttpException({
                message: 'error scheduling monthly turn over',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMonthlyTurnOverQueueCount() {
        const [count, active, failed] = await Promise.all([
            this.magazineQueue.count(),
            this.magazineQueue.getActiveCount(),
            this.magazineQueue.getFailedCount(),
        ]);
        return { count, active, failed };
    }
    async manySendForPrinting({ month, year }) {
        return this.magazinesService.updateMany({ month, year }, { status: magazine_schema_1.MagazineStatus.SENT_FOR_PRINTING }, { new: true });
    }
    async singleSendForPrinting({ month, year, customer, }) {
        return this.magazinesService.updateOne({ month, year, customer }, { status: magazine_schema_1.MagazineStatus.SENT_FOR_PRINTING }, { new: true });
    }
    async schedulePermanentLinksTurnOver({ month, year, }) {
        const magazines = await this.magazinesService.find({
            month,
            year,
        }, { populate: ['customer'], batchSize: 1000 });
        const jobs = magazines.map((magazine) => {
            return {
                data: {
                    magazine,
                },
                opts: {
                    removeOnComplete: true,
                },
            };
        });
        await this.permanentLinkQueue.addBulk(jobs);
        return {
            message: 'magazine permanent link changes scheduled',
            jobs: jobs.length,
        };
    }
    async getPermanentQueueCount() {
        const [count, active, failed] = await Promise.all([
            this.permanentLinkQueue.count(),
            this.permanentLinkQueue.getActiveCount(),
            this.permanentLinkQueue.getFailedCount(),
        ]);
        return { count, active, failed };
    }
};
ReferralMarketingAdminsService = __decorate([
    (0, common_1.Injectable)(),
    __param(7, (0, common_1.Inject)('logger')),
    __param(8, (0, bull_1.InjectQueue)(constants_1.MONTHLY_TURN_OVER_MAGAZINE_QUEUE)),
    __param(9, (0, bull_1.InjectQueue)(constants_1.PERMANENT_LINKS_TURN_OVER)),
    __metadata("design:paramtypes", [generated_magazines_service_1.GeneratedMagazinesService,
        magazines_service_1.MagazinesService,
        customers_service_1.CustomersService,
        hubspot_service_1.HubspotService,
        generated_magazines_repository_1.GeneratedMagazinesRepository,
        magazines_repository_1.MagazinesRepository,
        cms_service_1.CmsService,
        common_1.Logger, Object, Object])
], ReferralMarketingAdminsService);
exports.ReferralMarketingAdminsService = ReferralMarketingAdminsService;
//# sourceMappingURL=referral-marketing-admins.service.js.map
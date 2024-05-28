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
exports.AdminPermanentLinkQueueProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../constants");
const functions_1 = require("../../../internal/utils/functions");
const magazines_service_1 = require("../services/magazines.service");
const generated_magazines_service_1 = require("../services/generated-magazines.service");
const common_1 = require("@nestjs/common");
const flippingbook_service_1 = require("../../../integrations/flippingbook/services/flippingbook.service");
const customers_service_1 = require("../../../customers/customers/customers.service");
let AdminPermanentLinkQueueProcessor = class AdminPermanentLinkQueueProcessor {
    constructor(magazinesService, generatedMagazinesService, flippingBookService, customerService) {
        this.magazinesService = magazinesService;
        this.generatedMagazinesService = generatedMagazinesService;
        this.flippingBookService = flippingBookService;
        this.customerService = customerService;
    }
    async handleJob(job) {
        try {
            const magazine = job.data.magazine;
            const generatedMagazine = await this.generatedMagazinesService.findOneGM({
                magazine: magazine._id,
            }, { populate: ['customer'] });
            if (!generatedMagazine || !generatedMagazine.url) {
                throw new Error(`couldn't find generated magazine in magazine monthly cronjob`);
            }
            this.generatedMagazineValidation(generatedMagazine);
            const customer = generatedMagazine.customer;
            const permanentUrl = await this.checkFlippingBookPermanentUrl(customer);
            const hashId = this.flippingBookService.getHashIdFromUrl(permanentUrl);
            const magazineName = `${customer.firstName} ${customer.lastName} - Home Sweet Home`;
            await this.flippingBookService.updatePublicationByHashId(hashId, {
                url: generatedMagazine.url,
                name: magazineName,
                description: magazineName,
                domain: constants_1.MAGAZINE_DOMAIN,
            });
            await (0, functions_1.sleep)(15000);
        }
        catch (error) {
            throw new common_1.HttpException({
                message: 'could not find magazine details in magazine monthly cronjob',
                error,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    generatedMagazineValidation(gm) {
        const validations = {
            'could not find generated magazine': () => !gm,
            'could not find generated magazine url': () => !gm.url,
            'could not find generated magazine customer': () => !gm.customer,
        };
        Object.entries(validations).forEach(([errorMessage, isValid]) => {
            if (isValid()) {
                throw new Error(errorMessage);
            }
        });
    }
    async checkFlippingBookPermanentUrl(customer) {
        const fbp = customer.flippingBookPreferences;
        let permanentUrl = fbp === null || fbp === void 0 ? void 0 : fbp.permanentPublicationUrl;
        if (!permanentUrl && (fbp === null || fbp === void 0 ? void 0 : fbp.publicationUrl)) {
            permanentUrl = fbp.publicationUrl;
            await this.customerService.updateFlippingBookPreferences(customer._id.toString(), {
                permanentPublicationId: fbp.publicationId,
                permanentPublicationName: fbp.publicationName,
                permanentRawFileUrl: fbp.rawFileUrl,
                permanentPublicationUrl: fbp.publicationUrl,
            });
        }
        if (!permanentUrl) {
            throw new Error('could not find flipping book permanent publication url');
        }
        return permanentUrl;
    }
};
__decorate([
    (0, bull_1.Process)({ concurrency: 1 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminPermanentLinkQueueProcessor.prototype, "handleJob", null);
AdminPermanentLinkQueueProcessor = __decorate([
    (0, bull_1.Processor)(constants_1.PERMANENT_LINKS_TURN_OVER),
    __metadata("design:paramtypes", [magazines_service_1.MagazinesService,
        generated_magazines_service_1.GeneratedMagazinesService,
        flippingbook_service_1.FlippingBookService,
        customers_service_1.CustomersService])
], AdminPermanentLinkQueueProcessor);
exports.AdminPermanentLinkQueueProcessor = AdminPermanentLinkQueueProcessor;
//# sourceMappingURL=admin-permanent-link-queue.processor.js.map
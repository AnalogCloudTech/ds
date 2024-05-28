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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMonthlyMagazineProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../constants");
const functions_1 = require("../../../internal/utils/functions");
const cms_service_1 = require("../../../cms/cms/cms.service");
const magazines_service_1 = require("../services/magazines.service");
const generated_magazines_service_1 = require("../services/generated-magazines.service");
const common_1 = require("@nestjs/common");
const month_helper_1 = require("../helpers/month.helper");
const luxon_1 = require("luxon");
const contexts_1 = require("../../../internal/common/contexts");
let AdminMonthlyMagazineProcessor = class AdminMonthlyMagazineProcessor {
    constructor(cmsService, magazinesService, generatedMagazinesService, logger) {
        this.cmsService = cmsService;
        this.magazinesService = magazinesService;
        this.generatedMagazinesService = generatedMagazinesService;
        this.logger = logger;
    }
    async handleJob(job) {
        var _a, e_1, _b, _c;
        var _d, _e, _f, _g;
        try {
            const { baseReplacers, customer, month, year } = job.data;
            let { selections } = job.data;
            const extendedMonthValue = (0, month_helper_1.enumToMonth)(month);
            if (!extendedMonthValue) {
                throw new Error('could not find extended month value');
            }
            const magazineDetails = await this.cmsService.magazineData({
                month: extendedMonthValue,
                year,
            });
            if (!(magazineDetails === null || magazineDetails === void 0 ? void 0 : magazineDetails.length)) {
                throw new common_1.HttpException({
                    message: `couldn't find magazine details in magazine monthly cronjob`,
                }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const { id, attributes: { month: monthCMS, year: yearCMS, pdf: { data: { attributes: { url }, }, }, }, } = magazineDetails[0];
            await this.magazinesService.adminCreate({
                magazineId: id,
                baseReplacers,
                customer,
                month: monthCMS,
                year: yearCMS,
                contentUrl: url,
                createdByAutomation: true,
            });
            selections = this.changeSelectionKeywords(selections);
            try {
                for (var _h = true, selections_1 = __asyncValues(selections), selections_1_1; selections_1_1 = await selections_1.next(), _a = selections_1_1.done, !_a;) {
                    _c = selections_1_1.value;
                    _h = false;
                    try {
                        const selection = _c;
                        selection.formKeyword = (_d = selection === null || selection === void 0 ? void 0 : selection.formKeyword) === null || _d === void 0 ? void 0 : _d.trim();
                        if (selection.formKeyword === 'frontInsideCover-option-1') {
                            const defaultValue = (_g = (_f = (_e = magazineDetails[0]) === null || _e === void 0 ? void 0 : _e.attributes) === null || _f === void 0 ? void 0 : _f.frontInsideCover[0]) === null || _g === void 0 ? void 0 : _g.defaultText;
                            selection.dynamicFields.forEach(({ keyword }, idx) => {
                                if (keyword === 'frontInsideCoverText') {
                                    selection.dynamicFields[idx].value = defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.replace(/(?:\r\n|\r|\n)/g, '<br />');
                                }
                            });
                        }
                        await this.magazinesService.update(customer, yearCMS, monthCMS, {
                            selection,
                        });
                        await (0, functions_1.sleep)(1000);
                    }
                    finally {
                        _h = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_h && !_a && (_b = selections_1.return)) await _b.call(selections_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            await this.generatedMagazinesService.create(customer, { year: yearCMS, month: monthCMS, createdByAutomation: true }, true, false);
            await (0, functions_1.sleep)(15000);
        }
        catch (err) {
            throw new common_1.HttpException({
                message: `couldn't find magazine details in magazine monthly cronjob`,
                error: err,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    changeSelectionKeywords(selections) {
        try {
            const newSelection = selections.map((selection) => {
                if (selection.formKeyword === 'backInsideCover-option-3') {
                    selection.dynamicFields.forEach(({ keyword }, idx) => {
                        if (keyword === 'listingImage') {
                            selection.dynamicFields[idx].keyword = 'listingImageJustSold';
                        }
                    });
                }
                if (selection.formKeyword === 'backInsideCover-option-4') {
                    selection.dynamicFields.forEach(({ keyword }, idx) => {
                        if (keyword === 'listingImage') {
                            selection.dynamicFields[idx].keyword = 'listingImageJustListed';
                        }
                    });
                }
                if (selection.formKeyword === 'backCover-option-5') {
                    selection.dynamicFields.forEach(({ keyword }, idx) => {
                        if (keyword === 'listingImage') {
                            selection.dynamicFields[idx].keyword = 'listingImageJustListed';
                        }
                    });
                }
                if (selection.formKeyword === 'backCover-option-4') {
                    selection.dynamicFields.forEach(({ keyword }, idx) => {
                        if (keyword === 'listingImage') {
                            selection.dynamicFields[idx].keyword = 'listingImageJustSold';
                        }
                    });
                }
                return selection;
            });
            return newSelection;
        }
        catch (err) {
            this.logger.log({
                payload: {
                    usageDate: luxon_1.DateTime.now(),
                    message: `error in changeSelectionKeywords ${err}`,
                },
            }, contexts_1.CONTEXT_MONTHLY_MAGAZINE_PROCESSOR);
            return selections;
        }
    }
};
__decorate([
    (0, bull_1.Process)({ concurrency: 1 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminMonthlyMagazineProcessor.prototype, "handleJob", null);
AdminMonthlyMagazineProcessor = __decorate([
    (0, bull_1.Processor)(constants_1.MONTHLY_TURN_OVER_MAGAZINE_QUEUE),
    __metadata("design:paramtypes", [cms_service_1.CmsService,
        magazines_service_1.MagazinesService,
        generated_magazines_service_1.GeneratedMagazinesService,
        common_1.Logger])
], AdminMonthlyMagazineProcessor);
exports.AdminMonthlyMagazineProcessor = AdminMonthlyMagazineProcessor;
//# sourceMappingURL=admin-monthly-magazine.processor.js.map
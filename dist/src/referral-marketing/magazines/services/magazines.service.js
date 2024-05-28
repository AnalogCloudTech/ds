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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagazinesService = void 0;
const common_1 = require("@nestjs/common");
const cms_service_1 = require("../../../cms/cms/cms.service");
const magazines_repository_1 = require("../repositories/magazines.repository");
const magazine_schema_1 = require("../schemas/magazine.schema");
const generated_magazines_service_1 = require("./generated-magazines.service");
const functions_1 = require("../../../internal/utils/functions");
const constants_1 = require("../constants");
const luxon_1 = require("luxon");
const contexts_1 = require("../../../internal/common/contexts");
let MagazinesService = class MagazinesService {
    constructor(generatedMagazinesService, magazinesRepository, cmsService, logger) {
        this.generatedMagazinesService = generatedMagazinesService;
        this.magazinesRepository = magazinesRepository;
        this.cmsService = cmsService;
        this.logger = logger;
        this.mapDisplayImageMagazine = (magazineData = []) => magazineData === null || magazineData === void 0 ? void 0 : magazineData.map((magazine) => {
            var _a, _b, _c;
            return (Object.assign(Object.assign({}, magazine), { displayImage: (_c = (_b = (_a = magazine === null || magazine === void 0 ? void 0 : magazine.displayImage) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.attributes) === null || _c === void 0 ? void 0 : _c.url }));
        });
    }
    async first(filter, options) {
        return this.magazinesRepository.findMagazine(filter, {}, options);
    }
    async find(filter, options) {
        return this.magazinesRepository.findAll(filter, options);
    }
    async create(customer, createMagazineDto) {
        const { attributes: { month, year, pdf: { data: { attributes: { url }, }, }, }, } = await this.cmsService.magazineDetails(createMagazineDto.magazineId);
        const mag = await this.magazinesRepository.create({
            month,
            year,
            customer: customer._id,
            magazineId: createMagazineDto.magazineId,
            baseReplacers: createMagazineDto.baseReplacers || [],
            contentUrl: url,
            createdByAutomation: !!createMagazineDto.createdByAutomation,
        });
        await this.updateSelections(month, year, mag);
        return mag;
    }
    async findAll(list) {
        return this.magazinesRepository.findAll(list);
    }
    async updateMag(magazineId, update, options) {
        return this.magazinesRepository.update(magazineId, update, options);
    }
    async findOne(customer, year, month) {
        return this.magazinesRepository.findOne(year, month, customer._id);
    }
    async update(customer, year, month, updateMagazineDto) {
        const magazineExists = await this.magazinesRepository.findOne(year, month, customer._id);
        if (!magazineExists)
            throw new common_1.HttpException({ message: 'magazine not found' }, common_1.HttpStatus.NOT_FOUND);
        const { selection } = updateMagazineDto;
        const filteredSelections = magazineExists.selections.reduce((acc, idx) => {
            if (selection && idx.page === selection.page) {
                return acc;
            }
            acc.push(idx);
            return acc;
        }, []);
        if (selection) {
            filteredSelections.push(selection);
        }
        const selections = filteredSelections;
        const selectionHasData = Object.keys(selection || {});
        if ((selectionHasData === null || selectionHasData === void 0 ? void 0 : selectionHasData.length) && !(selection === null || selection === void 0 ? void 0 : selection.formKeyword))
            throw new common_1.HttpException({ message: 'missing formKeyword' }, common_1.HttpStatus.BAD_REQUEST);
        const magazineInfo = await this.cmsService.magazineDetails(magazineExists.magazineId);
        const cover = await this.processCover(selection, magazineInfo);
        const filteredCovers = magazineExists.covers.reduce((acc, idx) => {
            if (cover && idx.order === cover.order) {
                return acc;
            }
            acc.push(idx);
            return acc;
        }, []);
        if (cover) {
            filteredCovers.push(cover);
        }
        const covers = filteredCovers;
        return this.magazinesRepository.update(magazineExists._id, Object.assign(Object.assign({}, updateMagazineDto), { selections, covers }), {
            new: true,
        });
    }
    async updateStatusByMagazineId(id, dto) {
        return this.magazinesRepository.updateStatusByMagazineId(id, dto);
    }
    async getMagazinePages(filters) {
        const response = await this.cmsService.magazineData(filters);
        if ((response === null || response === void 0 ? void 0 : response.length) > 0) {
            const data = response[0];
            return {
                id: data.id,
                month: data.attributes.month,
                year: data.attributes.year,
                pdf: data.attributes.pdf.data.attributes.url,
                previewPdf: data.attributes.previewPdf.data.attributes.url,
                frontCoverDesign: this.mapDisplayImageMagazine(data.attributes.frontCoverDesign),
                frontCoverStrip: this.mapDisplayImageMagazine(data.attributes.frontCoverStrip),
                frontInsideCover: this.mapDisplayImageMagazine(data.attributes.frontInsideCover),
                backInsideCover: this.mapDisplayImageMagazine(data.attributes.backInsideCover),
                backCover: this.mapDisplayImageMagazine(data.attributes.backCover),
            };
        }
        return null;
    }
    async processCover(selection, magazineInfo) {
        let html = await this.processMagazineData(selection === null || selection === void 0 ? void 0 : selection.formKeyword, magazineInfo.attributes);
        const replacers = selection === null || selection === void 0 ? void 0 : selection.dynamicFields;
        if (selection === null || selection === void 0 ? void 0 : selection.extraHtml) {
            const { formKeyword = '', dynamicFields, htmlReplacer, } = selection === null || selection === void 0 ? void 0 : selection.extraHtml;
            const extraHtml = await this.processMagazineData(formKeyword, magazineInfo.attributes);
            html = html.replace(`{{${htmlReplacer}}}`, extraHtml);
            if (dynamicFields === null || dynamicFields === void 0 ? void 0 : dynamicFields.length) {
                replacers.push(...dynamicFields);
            }
        }
        return {
            html,
            replacers,
            name: selection === null || selection === void 0 ? void 0 : selection.formKeyword,
            order: selection === null || selection === void 0 ? void 0 : selection.page,
        };
    }
    processMagazineData(formKeyword, attributes) {
        let form = null;
        Object.keys(attributes).forEach((key) => {
            if (Array.isArray(attributes[key]) && !form) {
                form = attributes[key].find((a) => a.formKeyword === formKeyword);
            }
        });
        if (!form)
            return null;
        return form.html;
    }
    async getMagazinesMetrics(page, perPage, year, month) {
        let filterQuery;
        let pageVisits;
        let sentToPrint;
        if (year && month) {
            filterQuery = {
                year,
                month,
            };
            pageVisits = Object.assign(Object.assign({}, filterQuery), { status: magazine_schema_1.MagazineStatus.EDITING });
            sentToPrint = Object.assign(Object.assign({}, filterQuery), { status: magazine_schema_1.MagazineStatus.SENT_FOR_PRINTING });
        }
        const magazineGeneratedCount = await this.generatedMagazinesService.getCountAllGeneratedMagazinesMetrics(year, month);
        const skip = page * perPage;
        return this.magazinesRepository.getMagazinesMetrics(page, perPage, skip, filterQuery, pageVisits, sentToPrint, magazineGeneratedCount);
    }
    async getMagazineEditingMetrics(page, perPage, year, month) {
        let filterQuery;
        if (year && month) {
            filterQuery = {
                year,
                month,
                status: magazine_schema_1.MagazineStatus.EDITING,
            };
        }
        const skip = page * perPage;
        return this.magazinesRepository.getMagazineMetricsByStatus(page, perPage, skip, filterQuery);
    }
    async getMagazineSentToPrintMetrics(page, perPage, year, month) {
        let filterQuery;
        if (year && month) {
            filterQuery = {
                year,
                month,
                status: magazine_schema_1.MagazineStatus.SENT_FOR_PRINTING,
            };
        }
        const skip = page * perPage;
        return this.magazinesRepository.getMagazineMetricsByStatus(page, perPage, skip, filterQuery);
    }
    async getAllMagazinesMetrics({ year, month }) {
        let filterQuery;
        if (year && month) {
            filterQuery = {
                year,
                month,
            };
        }
        return this.magazinesRepository.getAllMagazinesMetrics(filterQuery);
    }
    async getMagazinesMetricsBySearch(searchQuery, year, month, page, perPage) {
        let filterQuery;
        if (year && month) {
            filterQuery = {
                year,
                month,
            };
        }
        return this.magazinesRepository.getMagazinesMetricsBySearch(searchQuery, filterQuery, page, perPage);
    }
    async getBaseReplacers(magazineId, customerId) {
        const magazine = await this.magazinesRepository.findMagazine({
            _id: magazineId,
            customer: customerId,
        });
        if (!magazine) {
            throw new common_1.HttpException({ message: 'magazine not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        if (magazine.baseReplacers && magazine.baseReplacers.length > 0) {
            return magazine.baseReplacers;
        }
        const lastMonthMagazine = await this.magazinesRepository.findMagazine({
            id: { $ne: magazine._id },
            baseReplacers: { $size: 1 },
            customer: customerId,
        }, {}, { sort: { createdAt: -1 } });
        if (!lastMonthMagazine) {
            throw new common_1.HttpException({ message: 'could not find base replacers' }, common_1.HttpStatus.NOT_FOUND);
        }
        return lastMonthMagazine.baseReplacers;
    }
    async updateSelections(month, year, mag) {
        var _a, e_1, _b, _c;
        var _d;
        try {
            const { customer, selections } = mag;
            const magazineDetails = await this.cmsService.magazineData({
                month,
                year,
            });
            if (!(magazineDetails === null || magazineDetails === void 0 ? void 0 : magazineDetails.length)) {
                throw new common_1.HttpException({ message: `couldn't find magazine details in cms` }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const _e = magazineDetails.pop().attributes, { month: monthCMS, year: yearCMS } = _e, rest = __rest(_e, ["month", "year"]);
            try {
                for (var _f = true, selections_1 = __asyncValues(selections), selections_1_1; selections_1_1 = await selections_1.next(), _a = selections_1_1.done, !_a;) {
                    _c = selections_1_1.value;
                    _f = false;
                    try {
                        const selection = _c;
                        selection.formKeyword = (_d = selection === null || selection === void 0 ? void 0 : selection.formKeyword) === null || _d === void 0 ? void 0 : _d.trim();
                        if (selection.formKeyword === constants_1.FRONT_INSIDE_COVER_OPTION_1) {
                            const frontInsideCover = rest.frontInsideCover.pop();
                            const defaultValue = frontInsideCover === null || frontInsideCover === void 0 ? void 0 : frontInsideCover.defaultText;
                            selection.dynamicFields.forEach(({ keyword }, idx) => {
                                if (keyword === constants_1.FRONT_INSIDE_COVER_TEXT) {
                                    const formattedValue = defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.replace(/(?:\r\n|\r|\n)/g, '<br />');
                                    selection.dynamicFields[idx].value = formattedValue;
                                }
                            });
                        }
                        await this.update(customer, yearCMS, monthCMS, {
                            selection,
                        });
                        await (0, functions_1.sleep)(1000);
                    }
                    finally {
                        _f = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_f && !_a && (_b = selections_1.return)) await _b.call(selections_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        catch (err) {
            if (err instanceof Error) {
                this.logger.log({
                    payload: {
                        usageDate: luxon_1.DateTime.now(),
                        message: `Error - ${err}`,
                    },
                }, contexts_1.CONTEXT_SERVICE_MAGAZINE);
                throw new common_1.HttpException({ message: 'error while updating selections', error: err }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getMagazineCustomerWithoutMagazine({ lastData, currentData, }) {
        const [magazineOwnersFromLastMonth, magazineOwnersFromCurrentMonth] = await Promise.all([
            this.magazinesRepository.findAll({
                year: lastData.year,
                month: lastData.month,
                status: magazine_schema_1.MagazineStatus.SENT_FOR_PRINTING,
            }, {}, {
                limit: 0,
                skip: 0,
                populate: ['customer'],
                lean: true,
                readPreference: 'secondaryPreferred',
            }),
            this.magazinesRepository.findAll({
                year: currentData.year,
                month: currentData.month,
                $or: [{ status: magazine_schema_1.MagazineStatus.SENT_FOR_PRINTING }],
            }, { _id: 0, customer: 1 }, {
                skip: 0,
                limit: 0,
                lean: true,
                readPreference: 'secondaryPreferred',
            }),
        ]);
        const magazineOwnersOccurrence = new Map();
        const magazinesToBeCloned = [];
        magazineOwnersFromCurrentMonth.forEach(({ customer }) => {
            magazineOwnersOccurrence.set(customer.toString(), 1);
        });
        magazineOwnersFromLastMonth.forEach((_a) => {
            var _b;
            var { customer } = _a, rest = __rest(_a, ["customer"]);
            const magazineExists = magazineOwnersOccurrence.get(customer._id.toString());
            if (!magazineExists && customer && ((_b = rest.baseReplacers) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                magazinesToBeCloned.push(Object.assign({ customer }, rest));
            }
        });
        return magazinesToBeCloned;
    }
    async updateOne(filter, update, options) {
        return this.magazinesRepository.updateOne(filter, update, options);
    }
    async updateMany(filter, update, options) {
        return this.magazinesRepository.updateMany(filter, update, options);
    }
    async adminCreate(dto) {
        return this.magazinesRepository.create(dto);
    }
};
MagazinesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => generated_magazines_service_1.GeneratedMagazinesService))),
    __metadata("design:paramtypes", [generated_magazines_service_1.GeneratedMagazinesService,
        magazines_repository_1.MagazinesRepository,
        cms_service_1.CmsService,
        common_1.Logger])
], MagazinesService);
exports.MagazinesService = MagazinesService;
//# sourceMappingURL=magazines.service.js.map
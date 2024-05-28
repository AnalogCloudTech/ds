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
exports.MagazinesRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const magazine_schema_1 = require("../schemas/magazine.schema");
const date_1 = require("../../../internal/utils/date");
const functions_1 = require("../../../internal/utils/functions");
const paginator_1 = require("../../../internal/utils/paginator");
const lodash_1 = require("lodash");
let MagazinesRepository = class MagazinesRepository {
    constructor(magazineModel) {
        this.magazineModel = magazineModel;
    }
    async create({ customer, magazineId, year, month, baseReplacers, contentUrl, createdByAutomation = false, }) {
        const magazineExists = await this.magazineModel.findOne({
            customer,
            magazineId,
            year,
            month,
        });
        if (magazineExists) {
            throw new common_1.HttpException({ message: 'magazine already created' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const parsedMonth = date_1.Months[`${month.toLowerCase()}`];
        if (!parsedMonth) {
            throw new common_1.HttpException({ message: 'could not parse month' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const lastMagazineData = await this.cloneLastMagazineData(customer);
        const magazine = new this.magazineModel({
            selections: (lastMagazineData === null || lastMagazineData === void 0 ? void 0 : lastMagazineData.selections) || [],
            month: parsedMonth,
            year,
            magazineId,
            customer: customer,
            baseReplacers: (lastMagazineData === null || lastMagazineData === void 0 ? void 0 : lastMagazineData.baseReplacers) || baseReplacers,
            contentUrl,
            createdByAutomation,
        });
        return magazine.save();
    }
    async findOne(year, month, customerId) {
        const parsedMonth = date_1.Months[`${month.toLowerCase()}`];
        if (!parsedMonth) {
            throw new common_1.HttpException({ message: 'error parsing month' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const filter = {
            year,
            month: parsedMonth,
        };
        if (customerId)
            filter['customer'] = customerId;
        const magazine = await this.magazineModel.findOne(filter);
        if (!magazine) {
            throw new common_1.HttpException({ message: 'magazine not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        return magazine;
    }
    async find({ customer, month, year, page, perPage, sortOrder = 'desc', status, }) {
        const filter = (0, functions_1.PropertiesSanitizer)({
            customer: customer._id,
            month: date_1.Months[`${month === null || month === void 0 ? void 0 : month.toLowerCase()}`],
            year,
            status,
        });
        const total = await this.magazineModel.find(filter).countDocuments().exec();
        page = page || 0;
        perPage = perPage || 25;
        const skip = page * perPage;
        const data = await this.magazineModel
            .find(filter)
            .sort({ createdAt: sortOrder })
            .skip(skip)
            .limit(perPage)
            .exec();
        return paginator_1.PaginatorSchema.build(total, data, page, perPage);
    }
    async update(magazineId, updateQuery, options = { new: true }) {
        return this.magazineModel
            .findByIdAndUpdate(magazineId, updateQuery, options)
            .exec();
    }
    async updateStatusByMagazineId(id, { status }) {
        const newStatus = { status: status };
        const updated = await this.magazineModel
            .findByIdAndUpdate(id, newStatus, { new: true })
            .exec();
        return updated;
    }
    async getMagazinesMetrics(page, perPage, skip, filterQuery, pageVisits, sentToPrint, magazineGeneratedCount) {
        const [totalCount, pageVisitsCount, sentToPrintCount] = await Promise.all([
            this.magazineModel.countDocuments(filterQuery).exec(),
            this.magazineModel.countDocuments(pageVisits).exec(),
            this.magazineModel.countDocuments(sentToPrint).exec(),
        ]);
        const magazinesReports = await this.magazineModel
            .aggregate([
            {
                $match: Object.assign({}, filterQuery),
            },
            {
                $lookup: {
                    from: 'ds__customers',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customerInfo',
                },
            },
            {
                $lookup: {
                    from: 'ds__referralMarketing__generatedMagazine',
                    localField: '_id',
                    foreignField: 'magazine',
                    as: 'generatedMagazine',
                },
            },
            {
                $project: {
                    'customerInfo.firstName': 1,
                    'customerInfo.lastName': 1,
                    'customerInfo.email': 1,
                    'customerInfo.status': 1,
                    'generatedMagazine._id': 1,
                    'generatedMagazine.status': 1,
                    'generatedMagazine.updatedAt': 1,
                    'generatedMagazine.createdByAutomation': 1,
                    'generatedMagazine.active': 1,
                    'generatedMagazine.customer': 1,
                    year: 1,
                    month: 1,
                    status: 1,
                    customer: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    contentUrl: 1,
                },
            },
            {
                $unwind: {
                    path: '$customerInfo',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ])
            .skip(skip)
            .limit(perPage)
            .exec();
        if (totalCount === 0) {
            magazineGeneratedCount = 0;
        }
        const magazinesReportWithPagination = paginator_1.PaginatorSchema.build(totalCount, magazinesReports, page, perPage);
        return {
            MagazinesDetails: magazinesReportWithPagination,
            PageVistedCount: pageVisitsCount,
            MagazineGeneratedCount: magazineGeneratedCount,
            SentToPrintCount: sentToPrintCount,
        };
    }
    async getMagazineMetricsByStatus(page, perPage, skip, filterQuery) {
        var _a;
        const magazinesReports = await this.magazineModel
            .aggregate([
            {
                $match: Object.assign({}, filterQuery),
            },
            {
                $lookup: {
                    from: 'ds__customers',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customerInfo',
                },
            },
            {
                $lookup: {
                    from: 'ds__referralMarketing__generatedMagazine',
                    localField: '_id',
                    foreignField: 'magazine',
                    as: 'generatedMagazine',
                },
            },
            {
                $project: {
                    'customerInfo.firstName': 1,
                    'customerInfo.lastName': 1,
                    'customerInfo.email': 1,
                    'customerInfo.status': 1,
                    'generatedMagazine._id': 1,
                    'generatedMagazine.status': 1,
                    'generatedMagazine.updatedAt': 1,
                    'generatedMagazine.createdByAutomation': 1,
                    year: 1,
                    month: 1,
                    status: 1,
                    customer: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    contentUrl: 1,
                },
            },
            {
                $unwind: {
                    path: '$customerInfo',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ])
            .skip(skip)
            .limit(perPage)
            .exec();
        const total = await this.magazineModel
            .aggregate([
            {
                $match: Object.assign({}, filterQuery),
            },
            {
                $lookup: {
                    from: 'ds__customers',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customerInfo',
                },
            },
            {
                $lookup: {
                    from: 'ds__referralMarketing__generatedMagazine',
                    localField: '_id',
                    foreignField: 'magazine',
                    as: 'generatedMagazine',
                },
            },
            {
                $count: 'total',
            },
        ])
            .exec();
        const totalCount = (_a = total.pop()) === null || _a === void 0 ? void 0 : _a.total;
        const magazinesReportWithPaginaton = paginator_1.PaginatorSchema.build(totalCount, magazinesReports, page, perPage);
        return {
            MagazinesDetails: magazinesReportWithPaginaton,
        };
    }
    async getAllMagazinesMetrics(filterQuery) {
        const allMagazinesReports = await this.magazineModel
            .aggregate([
            {
                $match: Object.assign({}, filterQuery),
            },
            {
                $lookup: {
                    from: 'ds__customers',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customerInfo',
                },
            },
            {
                $lookup: {
                    from: 'ds__referralMarketing__generatedMagazine',
                    localField: '_id',
                    foreignField: 'magazine',
                    as: 'generatedMagazine',
                },
            },
            {
                $project: {
                    'customerInfo.firstName': 1,
                    'customerInfo.lastName': 1,
                    'customerInfo.email': 1,
                    'customerInfo.status': 1,
                    'generatedMagazine._id': 1,
                    'generatedMagazine.status': 1,
                    'generatedMagazine.updatedAt': 1,
                    'generatedMagazine.createdByAutomation': 1,
                    year: 1,
                    month: 1,
                    status: 1,
                    customer: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    contentUrl: 1,
                },
            },
            {
                $unwind: {
                    path: '$customerInfo',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ])
            .exec();
        return allMagazinesReports;
    }
    async getMagazinesMetricsBySearch(searchQuery, filterQuery, page, perPage) {
        const searchRegex = new RegExp(`^${searchQuery}$`, 'i');
        const matchWithSearchQuery = searchQuery
            ? {
                $or: [
                    { 'customerInfo.email': searchRegex },
                    { 'customerInfo.firstName': searchRegex },
                    { 'customerInfo.lastName': searchRegex },
                    { status: searchRegex },
                ],
            }
            : {};
        const skip = page * perPage;
        const magazinesReports = await this.magazineModel
            .aggregate([
            {
                $match: Object.assign({}, filterQuery),
            },
            {
                $lookup: {
                    from: 'ds__customers',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customerInfo',
                },
            },
            {
                $lookup: {
                    from: 'ds__referralMarketing__generatedMagazine',
                    localField: '_id',
                    foreignField: 'magazine',
                    as: 'generatedMagazine',
                },
            },
            {
                $match: matchWithSearchQuery,
            },
            {
                $project: {
                    'customerInfo.firstName': 1,
                    'customerInfo.lastName': 1,
                    'customerInfo.email': 1,
                    'customerInfo.status': 1,
                    'generatedMagazine._id': 1,
                    'generatedMagazine.status': 1,
                    'generatedMagazine.updatedAt': 1,
                    'generatedMagazine.createdByAutomation': 1,
                    year: 1,
                    month: 1,
                    status: 1,
                    customer: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
            {
                $unwind: {
                    path: '$customerInfo',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ])
            .skip(skip)
            .limit(perPage);
        let magazinesReportByEmail = [];
        if (searchQuery) {
            magazinesReports.filter((magazine) => {
                if (magazine.status.toLowerCase().replace('_', ' ') ===
                    searchQuery.toLowerCase()) {
                    magazinesReportByEmail.push(magazine);
                }
            });
            const getCustomerByEmail = (customerInfoKey, customerInfoValue, customerInfoData) => {
                if (customerInfoKey === 'customerInfo' &&
                    typeof customerInfoValue == 'object') {
                    Object.entries(customerInfoValue).forEach(([customerInfoKey, customerInfoValue]) => {
                        const condition = customerInfoValue.toLowerCase() === searchQuery.toLowerCase();
                        if (customerInfoKey === 'email' && condition) {
                            magazinesReportByEmail.push(customerInfoData);
                        }
                        else if (customerInfoKey === 'firstName' && condition) {
                            magazinesReportByEmail.push(customerInfoData);
                        }
                        else if (customerInfoKey === 'lastName' && condition) {
                            magazinesReportByEmail.push(customerInfoData);
                        }
                    });
                }
            };
            magazinesReports.forEach((customerInfoData) => {
                Object.entries(customerInfoData).forEach(([customerInfoKey, customerInfoValue]) => {
                    getCustomerByEmail(customerInfoKey, customerInfoValue, customerInfoData);
                });
            });
            if ((0, lodash_1.isEmpty)(magazinesReportByEmail)) {
                magazinesReportByEmail = magazinesReports.filter((result) => {
                    if (searchQuery.toUpperCase().startsWith('SENT')) {
                        return result.status === magazine_schema_1.MagazineStatus.SENT_FOR_PRINTING;
                    }
                    if (searchQuery.toUpperCase().startsWith('MAGAZINE')) {
                        return result.status === magazine_schema_1.MagazineStatus.MAGAZINE_GENERATED;
                    }
                    if (searchQuery.toUpperCase() === magazine_schema_1.MagazineStatus.EDITING) {
                        return result;
                    }
                });
            }
        }
        else {
            magazinesReportByEmail = magazinesReports;
        }
        const magazinesReportsTotal = magazinesReportByEmail.length;
        const magazinesReportWithPaginaton = paginator_1.PaginatorSchema.build(magazinesReportsTotal, magazinesReportByEmail, page, perPage);
        return magazinesReportWithPaginaton;
    }
    cloneLastMagazineData(customer) {
        return this.magazineModel
            .findOne({
            customer,
        }, {}, { sort: { createdAt: -1 } })
            .exec();
    }
    async findAll(filter, projection = null, options = { skip: 0, limit: 25, lean: true }) {
        return this.magazineModel.find(filter, projection, options);
    }
    async findMagazine(filter, projection = {}, options = { skip: 0, limit: 25, lean: true }) {
        return this.magazineModel.findOne(filter, projection, options);
    }
    async updateOne(filter, updateQuery, options) {
        return this.magazineModel.updateOne(filter, options);
    }
    async updateMany(filter, updateQuery, options) {
        return this.magazineModel.updateMany(filter, options);
    }
};
MagazinesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(magazine_schema_1.Magazine.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MagazinesRepository);
exports.MagazinesRepository = MagazinesRepository;
//# sourceMappingURL=magazines.repository.js.map
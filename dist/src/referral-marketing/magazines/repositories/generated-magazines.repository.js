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
exports.GeneratedMagazinesRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongodb_1 = require("mongodb");
const paginator_1 = require("../../../internal/utils/paginator");
const generated_magazine_schema_1 = require("../schemas/generated-magazine.schema");
let GeneratedMagazinesRepository = class GeneratedMagazinesRepository {
    constructor(generatedMagazineModel) {
        this.generatedMagazineModel = generatedMagazineModel;
    }
    async findGM(filter, options) {
        return this.generatedMagazineModel.find(filter, {}, options).exec();
    }
    async findOneGM(filter, options) {
        return this.generatedMagazineModel.findOne(filter, {}, options).exec();
    }
    async updateGM(where, update, options = { new: true }) {
        return this.generatedMagazineModel
            .findOneAndUpdate(where, update, options)
            .exec();
    }
    async count(magazineIds) {
        return this.generatedMagazineModel
            .countDocuments({
            magazine: { $in: magazineIds },
            status: generated_magazine_schema_1.GenerationStatus.DONE,
        })
            .exec();
    }
    async create(customer, magazine, isPreview = false, createdByAutomation = false) {
        await this.generatedMagazineModel.updateMany({ customer: customer._id, active: true }, { active: false });
        const lastMonth = await this.cloneLastGeneratedMagazineData(customer._id);
        const generatedMagazine = new this.generatedMagazineModel({
            pageUrl: (lastMonth === null || lastMonth === void 0 ? void 0 : lastMonth.pageUrl) || '',
            bookUrl: (lastMonth === null || lastMonth === void 0 ? void 0 : lastMonth.bookUrl) || '',
            magazine,
            customer: customer._id,
            isPreview,
            status: generated_magazine_schema_1.GenerationStatus.PENDING,
            createdByAutomation,
        });
        await generatedMagazine.save();
        return generatedMagazine.populate(['magazine', 'customer']);
    }
    async upsert(customer, magazine, isPreview = false, createdByAutomation = false) {
        const generatedMagazineExists = await this.generatedMagazineModel.findOne({
            magazine: magazine._id,
            customer: customer._id,
            active: true,
        });
        if (!generatedMagazineExists) {
            return this.create(customer, magazine, isPreview, createdByAutomation);
        }
        return this.update(customer, { isPreview, status: generated_magazine_schema_1.GenerationStatus.PENDING, createdByAutomation }, magazine);
    }
    async find(customer, active) {
        const filter = { customer };
        if (active) {
            filter['active'] = active;
        }
        return this.generatedMagazineModel
            .find(filter)
            .populate(['customer', 'magazine']);
    }
    async findById(generatedMagazineId, customer) {
        const filter = { _id: generatedMagazineId };
        if (customer) {
            filter['customer'] = customer;
        }
        const generatedMagazine = await this.generatedMagazineModel
            .findOne(filter)
            .populate(['magazine', 'customer'])
            .exec();
        if (!generatedMagazine) {
            throw new common_1.HttpException({ message: 'generated magazine id not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        return generatedMagazine;
    }
    async findOne(customer, magazine) {
        const generatedMagazine = await this.generatedMagazineModel
            .findOne({
            magazine: magazine._id,
            active: true,
            customer,
        })
            .populate('magazine')
            .exec();
        if (!generatedMagazine) {
            throw new common_1.HttpException({ message: 'generated magazine not found' }, 404);
        }
        return generatedMagazine;
    }
    async getMagazinePreview({ id, email, year, month, }) {
        let filterQuery = {};
        if (id) {
            filterQuery = {
                _id: new mongodb_1.ObjectId(id),
            };
        }
        else {
            filterQuery = {
                'customerInfo.email': {
                    $eq: email,
                },
            };
        }
        const magazinePreviewData = await this.generatedMagazineModel
            .aggregate([
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
                    from: 'ds__referralMarketing__magazine',
                    localField: 'magazine',
                    foreignField: '_id',
                    as: 'magazineInfo',
                },
            },
            {
                $match: Object.assign({}, filterQuery),
            },
            {
                $project: {
                    magazine: 1,
                    url: 1,
                    status: 1,
                    active: 1,
                    flippingBookUrl: 1,
                    coverImage: 1,
                    pageUrl: 1,
                    bookUrl: 1,
                    pageStatus: 1,
                    coversOnlyUrl: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    createdByAutomation: 1,
                    customerInfo: {
                        email: 1,
                        firstName: 1,
                        lastName: 1,
                    },
                    'magazineInfo.month': 1,
                },
            },
        ])
            .exec();
        let magazinePreview;
        const filterMagazineByDate = magazinePreviewData.forEach((magazine) => {
            Object.entries(magazine).forEach(([magazineKey, magazineValue]) => {
                if (magazineKey === 'createdAt') {
                    const date = magazineValue.toString();
                    const magazineDate = `${date.slice(4, 7)}-${date.slice(11, 15)}`.toLowerCase();
                    const dateRequeried = `${month}-${year}`.toLowerCase();
                    if (magazineDate === dateRequeried) {
                        magazinePreview = magazine;
                    }
                }
            });
        });
        if (month && year) {
            filterMagazineByDate;
        }
        else {
            magazinePreview = magazinePreviewData[0];
        }
        return magazinePreview;
    }
    async getAllGeneratedMagazinesMetrics(page, perPage, skip, filterQuery) {
        const allGeneratedMagazines = await this.generatedMagazineModel
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
                    from: 'ds__referralMarketing__magazine',
                    localField: 'magazine',
                    foreignField: '_id',
                    as: 'magazineInfo',
                },
            },
            {
                $project: {
                    'customerInfo.firstName': 1,
                    'customerInfo.lastName': 1,
                    'customerInfo.email': 1,
                    'customerInfo.status': 1,
                    'magazineInfo.status': 1,
                    'magazineInfo.month': 1,
                    year: 1,
                    month: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    contentUrl: 1,
                    magazine: 1,
                    createdByAutomation: 1,
                    isPreview: 1,
                },
            },
            {
                $unwind: {
                    path: '$customerInfo',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: '$magazineInfo',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ])
            .limit(perPage)
            .skip(skip)
            .exec();
        const total = await this.generatedMagazineModel
            .countDocuments(filterQuery)
            .exec();
        const magazinesReportWithPagination = paginator_1.PaginatorSchema.build(total, allGeneratedMagazines, page, perPage);
        return magazinesReportWithPagination;
    }
    async getCountAllGeneratedMagazinesMetrics(filterQuery) {
        return this.generatedMagazineModel.countDocuments(filterQuery).exec();
    }
    async update(customer, generatedMagazineData, magazine) {
        const generatedMagazine = await this.generatedMagazineModel.findOneAndUpdate({
            magazine: magazine._id,
            active: true,
            customer,
        }, Object.assign({}, generatedMagazineData), { new: true });
        if (!generatedMagazine) {
            throw new common_1.HttpException({ message: 'generated magazine not found' }, 404);
        }
        return generatedMagazine.populate(['magazine', 'customer']);
    }
    async updateById(generatedMagazineId, { status, url, flippingBookUrl, coverImageHtml, pageUrl, pageStatus, bookUrl, coversOnlyUrl, }) {
        const generatedMagazine = await this.generatedMagazineModel.findOneAndUpdate({ _id: generatedMagazineId }, {
            status,
            url,
            flippingBookUrl,
            coverImage: coverImageHtml,
            pageUrl,
            pageStatus,
            bookUrl,
            coversOnlyUrl,
        }, { new: true });
        if (!generatedMagazine) {
            throw new common_1.HttpException({ message: 'generated magazine not found' }, 404);
        }
        return generatedMagazine;
    }
    async updateLeadCoversById(generatedMagazineId, dto) {
        const leadData = {
            lead: new mongodb_1.ObjectId(dto.lead),
            coversUrl: dto.coversUrl,
            fullContentUrl: dto.fullContentUrl,
        };
        const generatedMagazine = await this.generatedMagazineModel.findOneAndUpdate({ _id: generatedMagazineId }, {
            $push: {
                leadCovers: leadData,
            },
        }, { new: true });
        if (!generatedMagazine) {
            throw new common_1.HttpException({ message: 'generated magazine not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        return generatedMagazine;
    }
    cloneLastGeneratedMagazineData(customer) {
        return this.generatedMagazineModel
            .findOne({
            customer,
        }, { sort: { createdAt: -1 } })
            .exec();
    }
    async findByMagazineId(generatedMagazineId) {
        const generatedMagazine = await this.generatedMagazineModel
            .findOne({
            magazine: generatedMagazineId,
            active: true,
        })
            .populate(['magazine'])
            .exec();
        if (!generatedMagazine) {
            throw new common_1.HttpException({ message: 'generated magazine not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        return generatedMagazine;
    }
};
GeneratedMagazinesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(generated_magazine_schema_1.GeneratedMagazine.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], GeneratedMagazinesRepository);
exports.GeneratedMagazinesRepository = GeneratedMagazinesRepository;
//# sourceMappingURL=generated-magazines.repository.js.map
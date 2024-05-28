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
exports.ReferralMarketingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const referral_marketing_schema_1 = require("./schemas/referral-marketing.schema");
const common_helpers_1 = require("./helpers/common.helpers");
const paginator_1 = require("../../internal/utils/paginator");
const types_1 = require("./domain/types");
let ReferralMarketingService = class ReferralMarketingService {
    constructor(referralModel, commonHelper) {
        this.referralModel = referralModel;
        this.commonHelper = commonHelper;
    }
    async create(createReferralMarketingDto) {
        createReferralMarketingDto.referralCode =
            this.commonHelper.randomGenerator();
        const referralMarketing = new this.referralModel(createReferralMarketingDto);
        const ReferralMarketingSaved = await referralMarketing.save();
        return ReferralMarketingSaved;
    }
    async findAll(page, perPage, status, sorting) {
        let filterObject = {};
        let dateSorting;
        if (status != types_1.ChangeStatus.ALL) {
            filterObject = { changeStatus: status };
        }
        if (sorting) {
            dateSorting = sorting;
        }
        const skip = page * perPage;
        const total = await this.referralModel.find().countDocuments().exec();
        const referralMarketingList = (await this.referralModel
            .find(filterObject)
            .skip(skip)
            .limit(perPage)
            .sort({ 'memberDetails.submittedDate': dateSorting })
            .exec()).map((item) => item);
        return paginator_1.PaginatorSchema.build(total, referralMarketingList, page, perPage);
    }
    async findOne(id) {
        const referralMarketingDetails = await this.referralModel.findById(id);
        return referralMarketingDetails;
    }
    async update(id, updateReferralMarketingDto) {
        return this.referralModel
            .findByIdAndUpdate(id, updateReferralMarketingDto, { new: true })
            .exec();
    }
    remove(id) {
        return this.referralModel.findByIdAndDelete(id).exec();
    }
};
ReferralMarketingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(referral_marketing_schema_1.ReferralMarketing.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        common_helpers_1.CommonHelper])
], ReferralMarketingService);
exports.ReferralMarketingService = ReferralMarketingService;
//# sourceMappingURL=referral-marketing.service.js.map
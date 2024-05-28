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
exports.AttributesService = void 0;
const attributes_1 = require("../../../customers/customers/domain/attributes");
const paginator_1 = require("../../../internal/utils/paginator");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AttributesService = class AttributesService {
    constructor(attributeModel) {
        this.attributeModel = attributeModel;
    }
    async create(customer, createAttributeDto) {
        createAttributeDto.customerId = customer.id;
        const attribute = await new this.attributeModel(createAttributeDto);
        return await attribute.save();
    }
    async findAll(page, perPage) {
        const skip = page * perPage;
        const total = await this.attributeModel.find().countDocuments().exec();
        const campaignList = await this.attributeModel
            .find()
            .skip(skip)
            .limit(perPage)
            .exec();
        return paginator_1.PaginatorSchema.build(total, campaignList, page, perPage);
    }
    async findOne(id) {
        return this.attributeModel.findById(id);
    }
    update(id, updateAttributeDto) {
        return this.attributeModel
            .findByIdAndUpdate(id, updateAttributeDto, { new: true })
            .exec();
    }
    remove(id) {
        return this.attributeModel.findByIdAndDelete(id).exec();
    }
    findAllByCustomerId(customer) {
        return this.attributeModel.find({
            customerId: customer.id,
        });
    }
};
AttributesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(attributes_1.Attributes.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AttributesService);
exports.AttributesService = AttributesService;
//# sourceMappingURL=attributes.service.js.map
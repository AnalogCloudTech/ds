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
exports.ProductsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const paginator_1 = require("../../../internal/utils/paginator");
const product_schema_1 = require("../schemas/product.schema");
const types_1 = require("../domain/types");
let ProductsRepository = class ProductsRepository {
    constructor(model) {
        this.model = model;
    }
    create(dto) {
        return new this.model(dto).save();
    }
    async findAll(page = 0, perPage = 25, searchQuery = '') {
        const filter = searchQuery
            ? {
                chargifyComponentId: {
                    $eq: searchQuery,
                },
            }
            : {};
        const skip = page * perPage;
        const total = await this.model.find().countDocuments().exec();
        const paymentList = await this.model
            .find(filter)
            .skip(skip)
            .limit(perPage)
            .exec();
        return paginator_1.PaginatorSchema.build(total, paymentList, page, perPage);
    }
    findOne(id) {
        return this.model.findById(id);
    }
    update(id, dto) {
        return this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    }
    remove(id) {
        return this.model.findByIdAndDelete(id).exec();
    }
    async getProductsNeedToBeSynced() {
        const filters = {
            chargifyComponentId: { $exists: true },
        };
        return this.model.find(filters).exec();
    }
    async findProductByChargifyId(chargifyComponentId, type = types_1.Type.SUBSCRIPTION) {
        return this.model.findOne({
            chargifyComponentId,
            type,
        });
    }
    async find(filter, options) {
        return this.model.findOne(filter, options).exec();
    }
    async findProductByStripeId(stripeId) {
        return this.model.findOne({
            stripeId,
            type: types_1.Type.SUBSCRIPTION,
        });
    }
};
ProductsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsRepository);
exports.ProductsRepository = ProductsRepository;
//# sourceMappingURL=products.repository.js.map
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
exports.ProductsIntegrationsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_integrations_schema_1 = require("../schemas/product-integrations.schema");
const paginator_1 = require("../../../internal/utils/paginator");
let ProductsIntegrationsRepository = class ProductsIntegrationsRepository {
    constructor(model) {
        this.model = model;
    }
    async create(product) {
        return this.model.create(product);
    }
    async findByChargifyId(chargifyId) {
        return this.model.findOne({ chargifyId });
    }
    async findAll(page = 0, perPage = 25) {
        const total = await this.model.find().countDocuments().exec();
        const skip = page * perPage;
        const products = await this.model.find().skip(skip).limit(perPage).exec();
        return paginator_1.PaginatorSchema.build(total, products, page, perPage);
    }
};
ProductsIntegrationsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_integrations_schema_1.ProductIntegration.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsIntegrationsRepository);
exports.ProductsIntegrationsRepository = ProductsIntegrationsRepository;
//# sourceMappingURL=products-integrations.repository.js.map
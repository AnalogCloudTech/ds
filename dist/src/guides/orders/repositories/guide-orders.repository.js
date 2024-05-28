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
exports.GuideOrdersRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const guide_orders_schema_1 = require("../schemas/guide-orders.schema");
const generic_repository_1 = require("../../../internal/common/repository/generic.repository");
const mongoose_2 = require("mongoose");
const paginator_1 = require("../../../internal/utils/paginator");
let GuideOrdersRepository = class GuideOrdersRepository extends generic_repository_1.GenericRepository {
    constructor(model) {
        super(model);
        this.model = model;
    }
    create(dto, customerId) {
        const params = Object.assign(Object.assign({}, dto), { customer: customerId });
        return this.model.create(params);
    }
    async count() {
        return this.model.countDocuments();
    }
    async getLatestOrder(customerId, guideId) {
        const query = {
            $or: [
                {
                    customer: customerId,
                    guideId,
                },
                {
                    customer: customerId,
                },
            ],
        };
        return this.model
            .findOne(query)
            .sort({ createdAt: -1 })
            .exec();
    }
    insertMany(dto) {
        return this.model.insertMany(dto);
    }
    async findByCustomerId(customerId, page, perPage) {
        const skip = page * perPage;
        const query = { customer: customerId };
        const total = await this.model.countDocuments(query).exec();
        const orders = await this.model
            .find(query)
            .skip(skip)
            .limit(perPage)
            .sort({
            createdAt: -1,
        })
            .exec();
        return paginator_1.PaginatorSchema.build(total, orders, page, perPage);
    }
};
GuideOrdersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(guide_orders_schema_1.GuideOrders.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], GuideOrdersRepository);
exports.GuideOrdersRepository = GuideOrdersRepository;
//# sourceMappingURL=guide-orders.repository.js.map
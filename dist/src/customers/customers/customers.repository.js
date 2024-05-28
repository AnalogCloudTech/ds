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
exports.CustomersRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const customer_schema_1 = require("./schemas/customer.schema");
let CustomersRepository = class CustomersRepository {
    constructor(customerModel) {
        this.customerModel = customerModel;
    }
    async findAll(filter, options = { lean: true }) {
        return this.customerModel.find(filter, {}, options).exec();
    }
    async update(id, updateProperties) {
        const customer = await this.customerModel.findByIdAndUpdate(id, updateProperties, {
            new: true,
        });
        if (!customer) {
            throw new common_1.HttpException({ message: 'Customer not found', method: 'update' }, common_1.HttpStatus.NOT_FOUND);
        }
        return customer;
    }
    async find(filter, page = 0, limit = 25) {
        const skip = page * limit;
        return this.customerModel.find(filter).skip(skip).limit(limit).exec();
    }
    async findOne(filter) {
        return this.customerModel.findOne(filter).exec();
    }
    async listByNameOrEmail(nameOrEmail) {
        const filter = {
            $or: [
                { fullName: new RegExp(nameOrEmail) },
                { email: new RegExp(nameOrEmail) },
            ],
        };
        return this.customerModel.aggregate([
            {
                $project: {
                    _id: 1,
                    email: 1,
                    fullName: { $concat: ['$firstName', ' ', '$lastName'] },
                },
            },
            {
                $match: Object.assign({}, filter),
            },
        ]);
    }
    async findByPhone(phone) {
        const pipeline = [
            {
                $addFields: {
                    phoneWithoutFormat: {
                        $replaceAll: {
                            input: '$phone',
                            find: '-',
                            replacement: '',
                        },
                    },
                },
            },
            {
                $match: {
                    phone: { $ne: null },
                    phoneWithoutFormat: { $eq: phone },
                },
            },
        ];
        const result = await this.customerModel.aggregate(pipeline);
        return result.length ? result[0] : null;
    }
};
CustomersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(customer_schema_1.Customer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CustomersRepository);
exports.CustomersRepository = CustomersRepository;
//# sourceMappingURL=customers.repository.js.map
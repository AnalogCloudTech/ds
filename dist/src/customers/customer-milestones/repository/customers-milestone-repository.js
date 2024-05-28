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
exports.CustomersMilestoneRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const generic_repository_1 = require("../../../internal/common/repository/generic.repository");
const customer_milestone_schema_1 = require("../schema/customer-milestone.schema");
let CustomersMilestoneRepository = class CustomersMilestoneRepository extends generic_repository_1.GenericRepository {
    constructor(model) {
        super(model);
        this.model = model;
    }
    async countMilestones() {
        const total = await this.model.aggregate([
            {
                $group: {
                    _id: '$customer',
                    milestones: {
                        $push: {
                            milestoneName: '$milestoneName',
                            status: '$status',
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'ds__customers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'customer',
                },
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [{ $arrayElemAt: ['$customer', 0] }, '$$ROOT'],
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                },
            },
        ]);
        return total.length;
    }
    async getAllMilestones(filter, options = { skip: 0, limit: 15, lean: true }) {
        const { skip, limit } = options;
        const milestones = await this.model
            .aggregate([
            {
                $group: {
                    _id: '$customer',
                    milestones: {
                        $push: {
                            milestoneName: '$milestoneName',
                            status: '$status',
                            value: '$value',
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'ds__customers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'customer',
                },
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [{ $arrayElemAt: ['$customer', 0] }, '$$ROOT'],
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    milestones: 1,
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    status: 1,
                },
            },
        ])
            .skip(skip)
            .limit(limit);
        return milestones;
    }
};
CustomersMilestoneRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(customer_milestone_schema_1.CustomerMilestone.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CustomersMilestoneRepository);
exports.CustomersMilestoneRepository = CustomersMilestoneRepository;
//# sourceMappingURL=customers-milestone-repository.js.map
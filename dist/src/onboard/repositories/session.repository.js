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
exports.SessionRepository = void 0;
const common_1 = require("@nestjs/common");
const generic_repository_1 = require("../../internal/common/repository/generic.repository");
const session_schema_1 = require("../schemas/session.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongodb_type_1 = require("../../internal/common/types/mongodb.type");
let SessionRepository = class SessionRepository extends generic_repository_1.GenericRepository {
    constructor(model) {
        super(model);
        this.model = model;
    }
    getSessionsToUpdateCustomerLastStepHubspot(filter) {
        const pipeline = [
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'ds__customers',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customer',
                },
            },
            {
                $unwind: {
                    path: '$customer',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    currentStep: 1,
                    'customer.email': 1,
                    'customer.firstName': 1,
                    'customer.hubspotId': 1,
                },
            },
        ];
        return this.model.aggregate(pipeline).exec();
    }
    onboardSalesReport(match = {}, skip, perPage) {
        return this.model
            .aggregate([
            {
                $match: match,
            },
            {
                $skip: skip,
            },
            {
                $limit: perPage,
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
                $unwind: {
                    path: '$customerInfo',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'ds__coaches',
                    localField: 'coach',
                    foreignField: '_id',
                    as: 'coachInfo',
                },
            },
            {
                $unwind: {
                    path: '$coachInfo',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'ds__onboard__offers',
                    localField: 'offer',
                    foreignField: '_id',
                    as: 'offerDetails',
                },
            },
            {
                $unwind: {
                    path: '$offerDetails',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'ds__customers_subscriptions',
                    localField: 'customer',
                    foreignField: 'customer',
                    as: 'customerStatus',
                },
            },
            {
                $unwind: {
                    path: '$customerStatus',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'ds__customer_events',
                    localField: 'customer',
                    foreignField: 'customer',
                    as: 'customerEvents',
                },
            },
            {
                $addFields: {
                    customerEvents: {
                        $first: '$customerEvents',
                    },
                },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $project: {
                    createdAt: 1,
                    updatedAt: 1,
                    customerInfo: {
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        stripeId: 1,
                        billing: 1,
                    },
                    offerDetails: { title: 1, trial: 1, code: 1 },
                    customerStatus: { status: 1, updatedAt: 1, subscriptionId: 1 },
                    customerEvents: { event: 1 },
                    marketingParameters: 1,
                    salesParameters: 1,
                    currentStep: 1,
                    coachingSelection: 1,
                    customer: 1,
                    coachInfo: { name: 1, email: 1 },
                },
            },
        ])
            .read('secondaryPreferred', [{ nodeType: mongodb_type_1.NODE_TYPES.ANALYTICS }]);
    }
    onboardSalesReportCount(match = {}) {
        return this.model.countDocuments(Object.assign({}, match));
    }
};
SessionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SessionRepository);
exports.SessionRepository = SessionRepository;
//# sourceMappingURL=session.repository.js.map
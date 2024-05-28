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
exports.CustomersService = void 0;
const paginator_1 = require("../../internal/utils/paginator");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = require("bcryptjs");
const id128_1 = require("id128");
const mongoose_2 = require("mongoose");
const dis_service_1 = require("../../legacy/dis/dis.service");
const customers_repository_1 = require("./customers.repository");
const customers_subscriptions_repository_1 = require("./customers-subscriptions.repository");
const types_1 = require("./domain/types");
const customer_schema_1 = require("./schemas/customer.schema");
const lodash_1 = require("lodash");
let CustomersService = class CustomersService {
    constructor(model, disService, customersRepository, customerSubscriptionRepository, logger) {
        this.model = model;
        this.disService = disService;
        this.customersRepository = customersRepository;
        this.customerSubscriptionRepository = customerSubscriptionRepository;
        this.logger = logger;
    }
    async findAll(filter = {}, options = { lean: true }) {
        return this.customersRepository.findAll(filter, options);
    }
    async getAllCustomers(page = 0, perPage = 15) {
        const skip = page * perPage;
        const total = await this.model.countDocuments().exec();
        const customers = await this.model
            .find()
            .limit(perPage)
            .skip(skip)
            .exec();
        return paginator_1.PaginatorSchema.build(total, customers, page, perPage);
    }
    async create(dto) {
        return new this.model(dto).save();
    }
    async syncCustomer(dto, status, customerEntity) {
        var _a;
        if (!customerEntity) {
            const customerData = Object.assign({ status }, dto);
            customerEntity = await new this.model(customerData).save();
        }
        const forceUpdate = status === types_1.Status.PENDING;
        const isMissingDependencies = this.isMissingDependencies(customerEntity);
        if (isMissingDependencies || forceUpdate) {
            const loginToken = id128_1.Uuid4.generate().toCanonical();
            let passwordEncrypted;
            if ((_a = dto.password) === null || _a === void 0 ? void 0 : _a.length) {
                passwordEncrypted = await bcrypt.hash(dto.password, 10);
            }
            const dependencies = await this.disService.syncDependencies(dto, loginToken, passwordEncrypted);
            customerEntity = await this.model.findByIdAndUpdate(customerEntity._id, Object.assign(Object.assign({}, dependencies), dto), { new: true });
        }
        return customerEntity;
    }
    async findByEmail(email) {
        const filter = {
            email: { $eq: email },
        };
        return this.model.findOne(filter).exec();
    }
    async landingPageDetailsByEmail(hubSpotEmails) {
        const result = await this.model.find({ email: { $in: hubSpotEmails } });
        return result;
    }
    async findByIdentities(identities) {
        return this.model.findOne({ email: { $in: identities } }).exec();
    }
    findById(id) {
        return this.model.findById(id).exec();
    }
    findOne(filter, options = { lean: true }) {
        return this.model.findOne(filter, {}, options).exec();
    }
    async authenticate(email, password) {
        return this.disService.authenticateCustomerThroughHubspot(email, password);
    }
    saveLandingPageProfile(id, dto) {
        return this.model
            .findByIdAndUpdate(id, { landingPageProfile: dto }, { new: true })
            .exec();
    }
    saveCampaignAttributes(id, dto) {
        return this.model
            .findByIdAndUpdate(id, { attributes: dto }, { new: true })
            .exec();
    }
    deleteAttribute(id) {
        return this.model
            .findByIdAndUpdate(id, { attributes: null }, { new: true })
            .exec();
    }
    saveOnboardBookPreferences(id, preferences) {
        return this.model
            .findByIdAndUpdate(id, { preferences }, {
            new: true,
        })
            .exec();
    }
    isMissingDependencies(customer) {
        return !Boolean(customer.hubspotId) || !Boolean(customer.stripeId);
    }
    updateFlippingBookPreferences(id, dto) {
        return this.customersRepository.update(id, {
            flippingBookPreferences: dto,
        });
    }
    async createSubscriptionorUnsubscription(customerId, subscriptionId, status, previousState) {
        const customerExists = await this.customersRepository.findOne({
            chargifyId: customerId,
        });
        if (!customerExists) {
            throw new common_1.HttpException({ message: 'customer not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        const dto = {
            customer: customerExists._id,
            status: status,
            subscriptionId: subscriptionId,
            previousState: previousState,
        };
        if (status === types_1.SubscriptionStatus.TRIALING ||
            (status === types_1.SubscriptionStatus.ACTIVE &&
                previousState === types_1.SubscriptionStatus.ACTIVE)) {
            return this.customerSubscriptionRepository.create(dto);
        }
        return this.customerSubscriptionRepository.update(dto);
    }
    async unsubscriptionReport(dto) {
        return this.customerSubscriptionRepository.unsubscriptionReport(dto);
    }
    async update(customer, dto) {
        var _a;
        if (!customer) {
            throw new common_1.HttpException({ message: 'missing customer' }, common_1.HttpStatus.BAD_REQUEST);
        }
        return this.customersRepository.update((_a = customer._id) === null || _a === void 0 ? void 0 : _a.toString(), dto);
    }
    async publicUpdate(email, avatar) {
        const customerExists = await this.customersRepository.findOne({ email });
        if (!customerExists) {
            throw new common_1.HttpException({ message: 'customer not found' }, common_1.HttpStatus.NOT_FOUND);
        }
        return this.customersRepository.update(customerExists._id.toString(), {
            avatar,
        });
    }
    async listByNameOrEmail(nameOrEmail) {
        return this.customersRepository.listByNameOrEmail(nameOrEmail);
    }
    async unsubscribeSMSRemindersByPhoneNumber(phone) {
        const phoneWithoutCode = phone.replace('+1', '');
        const customer = await this.customersRepository.findByPhone(phoneWithoutCode);
        const update = {
            $set: {
                'smsPreferences.schedulingCoachReminders': false,
            },
        };
        if ((0, lodash_1.isNull)(customer)) {
            return null;
        }
        return this.customersRepository.update(customer._id.toString(), update);
    }
    acceptedReceiveSMSScheduleCoachReminders(customer) {
        var _a;
        return Boolean((_a = customer === null || customer === void 0 ? void 0 : customer.smsPreferences) === null || _a === void 0 ? void 0 : _a.schedulingCoachReminders);
    }
    async addLandingPageWebsite(customerId, dto) {
        var _a, _b, _c;
        const customer = await this.customersRepository.findOne({
            _id: customerId,
        });
        if (!customer) {
            throw new Error('customer not found');
        }
        let opt = null;
        const website = (_a = customer === null || customer === void 0 ? void 0 : customer.landingPageProfile) === null || _a === void 0 ? void 0 : _a.generatedWebsites;
        if (!((_b = customer === null || customer === void 0 ? void 0 : customer.landingPageProfile) === null || _b === void 0 ? void 0 : _b.generatedWebsites)) {
            opt = {
                $set: {
                    'landingPageProfile.generatedWebsites': [dto],
                },
            };
        }
        if (!opt && ((_c = customer === null || customer === void 0 ? void 0 : customer.landingPageProfile) === null || _c === void 0 ? void 0 : _c.generatedWebsites) && website) {
            const wf = website.find((w) => w.guideId === dto.guideId);
            if (wf) {
                opt = {
                    $set: {
                        'landingPageProfile.generatedWebsites': website.map((w) => {
                            if (w.guideId === dto.guideId) {
                                return dto;
                            }
                            return w;
                        }),
                    },
                };
            }
            else {
                opt = {
                    $set: {
                        'landingPageProfile.generatedWebsites': [...website, dto],
                    },
                };
            }
        }
        return await this.customersRepository.update(customerId, opt);
    }
    async getLandingPageWebsite(customerEmail, id) {
        var _a, _b;
        const customer = await this.customersRepository.findOne({
            email: customerEmail,
        });
        if (!customer) {
            throw new Error('customer not found');
        }
        return (_b = (_a = customer === null || customer === void 0 ? void 0 : customer.landingPageProfile) === null || _a === void 0 ? void 0 : _a.generatedWebsites) === null || _b === void 0 ? void 0 : _b.find((website) => website.guideId === id);
    }
};
CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(customer_schema_1.Customer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        dis_service_1.DisService,
        customers_repository_1.CustomersRepository,
        customers_subscriptions_repository_1.CustomersSubscriptionsRepository,
        common_1.Logger])
], CustomersService);
exports.CustomersService = CustomersService;
//# sourceMappingURL=customers.service.js.map
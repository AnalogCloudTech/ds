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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerMilestoneService = void 0;
const common_1 = require("@nestjs/common");
const luxon_1 = require("luxon");
const customers_service_1 = require("../customers/customers.service");
const hubspot_service_1 = require("../../legacy/dis/legacy/hubspot/hubspot.service");
const contexts_1 = require("../../internal/common/contexts");
const types_1 = require("./domain/types");
const leads_service_1 = require("../../campaigns/email-campaigns/leads/leads.service");
const customers_milestone_repository_1 = require("./repository/customers-milestone-repository");
const paginator_1 = require("../../internal/utils/paginator");
const functions_1 = require("../../internal/utils/functions");
let CustomerMilestoneService = class CustomerMilestoneService {
    constructor(customerService, customerMilestoneRepository, hubspotService, leadsService, logger) {
        this.customerService = customerService;
        this.customerMilestoneRepository = customerMilestoneRepository;
        this.hubspotService = hubspotService;
        this.leadsService = leadsService;
        this.logger = logger;
    }
    async findAll(filter = {}, options = { lean: true }, page = 0, perPage = 10) {
        const [milestones, total] = await Promise.all([
            this.customerMilestoneRepository.getAllMilestones(filter, Object.assign({ skip: page * perPage, limit: perPage }, options)),
            this.customerMilestoneRepository.countMilestones(),
        ]);
        return paginator_1.PaginatorSchema.build(total, milestones, page, perPage);
    }
    async customerMilestone() {
        var _a, e_1, _b, _c;
        const customers = await this.customerService.findAll();
        const errors = [];
        try {
            for (var _d = true, customers_1 = __asyncValues(customers), customers_1_1; customers_1_1 = await customers_1.next(), _a = customers_1_1.done, !_a;) {
                _c = customers_1_1.value;
                _d = false;
                try {
                    const customer = _c;
                    await (0, functions_1.sleep)(1000);
                    this.logger.log({
                        payload: {
                            message: 'customer email',
                            customerEmail: customer.email,
                            usageDate: luxon_1.DateTime.now(),
                        },
                    }, contexts_1.CONTEXT_CUSTOMER_MILESTONE);
                    try {
                        const getHubspotCustomerDetails = await this.hubspotService.getContactById(customer.hubspotId, [
                            'afy_last_login_date',
                            'afy_customer_profile_image_url',
                        ]);
                        const { properties: { afy_last_login_date: customerLastLogin, afy_customer_profile_image_url: hubspotCustomerProfileImage, lastmodifieddate: customerLastModifiedDate, }, } = getHubspotCustomerDetails;
                        const lastCreatedLead = await this.leadsService.getLastCreatedLeadByCustomerId(customer._id);
                        await Promise.all([
                            this.updateCustomerProfileImage(customer._id, hubspotCustomerProfileImage, customerLastModifiedDate),
                            this.updateCustomerLastLogin(customer._id, customerLastLogin, customerLastModifiedDate),
                            this.updateCustomerLeads(customer._id, lastCreatedLead, customerLastModifiedDate),
                        ]);
                    }
                    catch (error) {
                        errors.push(error);
                    }
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = customers_1.return)) await _b.call(customers_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.logger.log({
            payload: {
                message: 'customer milestone errors',
                usageDate: luxon_1.DateTime.now(),
                errors: errors.length,
            },
        }, contexts_1.CONTEXT_CUSTOMER_MILESTONE);
    }
    async updateCustomerProfileImage(customerId, hubspotCustomerProfileImage, customerLastModifiedDate) {
        const customerMilestoneDto = {
            customer: customerId,
            milestoneName: types_1.CustomerMilestonesName.PROFILE_PICTURE,
            dateChecked: customerLastModifiedDate,
            status: types_1.CustomerMilestoneStatus.PENDING,
            value: hubspotCustomerProfileImage,
        };
        if (hubspotCustomerProfileImage) {
            customerMilestoneDto.status = types_1.CustomerMilestoneStatus.COMPLETED;
        }
        const milestoneDetails = await this.customerMilestoneRepository.first({
            customer: customerId,
            milestoneName: types_1.CustomerMilestonesName.PROFILE_PICTURE,
        });
        if (milestoneDetails) {
            return this.customerMilestoneRepository.update(milestoneDetails._id, customerMilestoneDto);
        }
        this.logger.log({
            payload: {
                message: 'Creating the profile details',
                profileImageUrl: hubspotCustomerProfileImage,
                usageDate: luxon_1.DateTime.now(),
            },
        }, contexts_1.CONTEXT_CUSTOMER_MILESTONE);
        return this.customerMilestoneRepository.store(customerMilestoneDto);
    }
    async updateCustomerLastLogin(customerId, customerLastLogin, customerLastModifiedDate) {
        const lastLogin = luxon_1.DateTime.fromISO(customerLastLogin);
        const thirtyDaysAgo = luxon_1.DateTime.now().minus({ days: 30 });
        const customerMilestoneDto = {
            customer: customerId,
            milestoneName: types_1.CustomerMilestonesName.LAST_LOGIN,
            dateChecked: customerLastModifiedDate,
            status: types_1.CustomerMilestoneStatus.PENDING,
            value: lastLogin.toISO(),
        };
        if (lastLogin > thirtyDaysAgo) {
            customerMilestoneDto.status = types_1.CustomerMilestoneStatus.COMPLETED;
        }
        const milestoneDetails = await this.customerMilestoneRepository.first({
            customer: customerId,
            milestoneName: types_1.CustomerMilestonesName.LAST_LOGIN,
        });
        if (milestoneDetails) {
            return this.customerMilestoneRepository.update(milestoneDetails._id, customerMilestoneDto);
        }
        this.logger.log({
            payload: {
                message: 'Creating the customer last login',
                lastLoginDate: lastLogin.toISO(),
                usageDate: luxon_1.DateTime.now(),
            },
        }, contexts_1.CONTEXT_CUSTOMER_MILESTONE);
        return this.customerMilestoneRepository.store(customerMilestoneDto);
    }
    async updateCustomerLeads(customerId, lastCreatedLead, customerLastModifiedDate) {
        const customerMilestoneDto = {
            customer: customerId,
            milestoneName: types_1.CustomerMilestonesName.LEADS,
            dateChecked: customerLastModifiedDate,
            status: types_1.CustomerMilestoneStatus.PENDING,
        };
        if (lastCreatedLead) {
            const createdAt = luxon_1.DateTime.fromJSDate(lastCreatedLead.createdAt);
            const thirtyDaysAgo = luxon_1.DateTime.now().minus({ days: 30 });
            if (createdAt > thirtyDaysAgo) {
                customerMilestoneDto.status = types_1.CustomerMilestoneStatus.COMPLETED;
            }
            const milestoneDetails = await this.customerMilestoneRepository.first({
                customer: customerId,
                milestoneName: types_1.CustomerMilestonesName.LEADS,
            });
            if (milestoneDetails) {
                return this.customerMilestoneRepository.update(milestoneDetails._id, customerMilestoneDto);
            }
            this.logger.log({
                payload: {
                    message: 'Creating the customer leads',
                    lastLeadCreatedAt: lastCreatedLead.createdAt,
                    usageDate: luxon_1.DateTime.now(),
                },
            }, contexts_1.CONTEXT_CUSTOMER_MILESTONE);
            return this.customerMilestoneRepository.store(customerMilestoneDto);
        }
        return this.customerMilestoneRepository.store(customerMilestoneDto);
    }
};
CustomerMilestoneService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, common_1.Inject)('logger')),
    __metadata("design:paramtypes", [customers_service_1.CustomersService,
        customers_milestone_repository_1.CustomersMilestoneRepository,
        hubspot_service_1.HubspotService,
        leads_service_1.LeadsService,
        common_1.Logger])
], CustomerMilestoneService);
exports.CustomerMilestoneService = CustomerMilestoneService;
//# sourceMappingURL=customer-milestone.service.js.map
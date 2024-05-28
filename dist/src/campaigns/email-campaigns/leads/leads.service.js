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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const json2csv_1 = require("json2csv");
const lead_schema_1 = require("./schemas/lead.schema");
const mongoose_2 = require("mongoose");
const lead_entity_1 = require("./entities/lead.entity");
const paginator_1 = require("../../../internal/utils/paginator");
const lodash_1 = require("lodash");
const segments_service_1 = require("../segments/segments.service");
const luxon_1 = require("luxon");
const customers_service_1 = require("../../../customers/customers/customers.service");
const create_lead_from_pagestead_dto_1 = require("./dto/create-lead-from-pagestead.dto");
const lead_1 = require("./domain/lead");
const serialize_interceptor_1 = require("../../../internal/common/interceptors/serialize.interceptor");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let LeadsService = class LeadsService {
    constructor(leadModel, segmentsService, customersService) {
        this.leadModel = leadModel;
        this.segmentsService = segmentsService;
        this.customersService = customersService;
    }
    async findAll(user) {
        const query = this.leadModel
            .find({ customerEmail: { $in: user.identities } })
            .sort({ createdAt: 1 });
        return query.exec();
    }
    async findAllLeadsByMemberEmailId(email) {
        const query = this.leadModel
            .find({ customerEmail: { $eq: email } })
            .sort({ createdAt: 1 });
        return query.exec();
    }
    async findAllPaginated(identities, customer, page, perPage, filters, sort) {
        let filterEmail = null;
        if (filters === null || filters === void 0 ? void 0 : filters.email) {
            const emailValue = new RegExp(filters.email);
            delete filters.email;
            filterEmail = {
                $or: [
                    { email: emailValue },
                    { firstName: emailValue },
                    { lastName: emailValue },
                ],
            };
        }
        const filter = Object.assign({ $and: [
                {
                    $or: [
                        { customerEmail: { $in: identities } },
                        { customer: { $eq: customer._id } },
                    ],
                },
            ] }, filters);
        if (filterEmail) {
            filter['$and'].push(filterEmail);
        }
        const total = await this.leadModel.find(filter).countDocuments().exec();
        const skip = page * perPage;
        const leads = await this.leadModel
            .find(filter)
            .skip(skip)
            .limit(perPage)
            .sort(sort)
            .exec();
        const segmentsId = [];
        (0, lodash_1.each)(leads, (item) => {
            (0, lodash_1.each)(item.segments, (segmentId) => segmentsId.push(segmentId));
        });
        const dataWithSegments = await this.segmentsService.attachSegments(leads, segmentsId);
        return paginator_1.PaginatorSchema.build(total, dataWithSegments, page, perPage);
    }
    async getLastCreatedLeadByCustomerId(customerId) {
        return this.leadModel
            .findOne({ customer: customerId })
            .sort({ createdAt: -1 })
            .exec();
    }
    async findAllWithSegments(user, customer) {
        const filters = {
            $or: [
                { customerEmail: { $in: user.identities } },
                { customer: { $eq: customer._id } },
            ],
        };
        const leads = await this.leadModel.find(filters).exec();
        const segmentsId = [];
        (0, lodash_1.each)(leads, (item) => {
            (0, lodash_1.each)(item.segments, (segmentId) => segmentsId.push(segmentId));
        });
        const dataWithSegments = await this.segmentsService.attachSegments(leads, segmentsId);
        return dataWithSegments;
    }
    async create(createLeadDto, customer) {
        const data = Object.assign({}, createLeadDto);
        if (!customer) {
            customer = await this.customersService.findByIdentities([
                createLeadDto.customerEmail,
            ]);
        }
        if (customer) {
            data['customer'] = customer;
        }
        const inheritedData = await this.fillWithInheritanceData(data.email, data);
        const createdLead = new this.leadModel(inheritedData);
        return await createdLead.save();
    }
    async findUserLead(customer, identities, id) {
        const lead = await this.leadModel
            .findOne({
            $and: [
                { _id: { $eq: id } },
                {
                    $or: [
                        { customerEmail: { $in: identities } },
                        { customer: { $eq: customer._id } },
                    ],
                },
            ],
        })
            .exec();
        if (!lead) {
            throw new common_1.HttpException('Document not found', common_1.HttpStatus.NOT_FOUND);
        }
        return lead;
    }
    async update(id, updateLeadDto) {
        return this.leadModel
            .findByIdAndUpdate(id, updateLeadDto, { new: true })
            .exec();
    }
    async updateMany(filter, data) {
        await this.leadModel.updateMany(filter, data).exec();
        return this.leadModel.find(filter).exec();
    }
    async updateUserLead(customer, identities, id, updateLeadDto) {
        const lead = await this.findUserLead(customer, identities, id);
        const data = Object.assign({}, updateLeadDto);
        data['customer'] = customer._id;
        return this.update(lead.id, data);
    }
    async remove(id) {
        return this.leadModel
            .findByIdAndUpdate(id, {
            deletedAt: luxon_1.DateTime.now().toJSDate(),
        }, { new: true })
            .exec();
    }
    async removeBulk(ids) {
        const now = luxon_1.DateTime.now().toJSDate();
        const result = await this.leadModel.updateMany({ _id: { $in: ids } }, { deletedAt: now });
        return result.acknowledged;
    }
    async removeUserLead(customer, identities, id) {
        const lead = await this.findUserLead(customer, identities, id);
        const duplicated = await this.findCustomerDuplicatedLeads(customer, lead.email, identities);
        return this.removeBulk(duplicated.map((item) => item._id));
    }
    async bulkRemoveCustomerLeads(customer, dto) {
        const results = await Promise.all(dto === null || dto === void 0 ? void 0 : dto.ids.map((id) => this.removeUserLead(customer, [], id)));
        return results.some((value) => value);
    }
    async batchStoreFromFile(dto, customer) {
        const leadsList = new lead_entity_1.LeadEntityList();
        const validList = new lead_entity_1.LeadEntityList();
        const invalidList = new lead_entity_1.LeadEntityList();
        const duplicated = new lead_entity_1.LeadEntityList();
        leadsList.setFile(dto.file);
        await leadsList.readFile();
        leadsList.setAll('segments', dto.segments);
        leadsList.setAll('customerEmail', dto.customerEmail);
        leadsList.setAll('bookId', dto.bookId);
        leadsList.setAll('allSegments', dto.allSegments === 'true');
        leadsList.setAll('customer', customer._id);
        for (const item of leadsList.list) {
            const validation = await item.validate();
            if (!validation.length) {
                const filter = {
                    $and: [
                        { email: { $eq: item.email } },
                        {
                            $or: [
                                { customerEmail: { $eq: dto.customerEmail } },
                                { customer: { $eq: customer._id } },
                            ],
                        },
                    ],
                };
                const duplicatedRecord = await this.leadModel.findOne(filter).exec();
                if (duplicatedRecord) {
                    duplicated.push(item);
                    continue;
                }
                validList.push(item);
            }
            else {
                invalidList.push(item);
            }
        }
        await this.leadModel.insertMany(validList.list);
        return {
            successCount: validList.list.length,
            duplicatedCount: duplicated.list.length,
            invalidCount: invalidList.list.length,
            successList: ((0, serialize_interceptor_1.resolverSerializer)(lead_1.Lead, validList.list)),
            duplicated: ((0, serialize_interceptor_1.resolverSerializer)(lead_1.Lead, duplicated.list)),
            invalidList: ((0, serialize_interceptor_1.resolverSerializer)(lead_1.Lead, invalidList.list)),
        };
    }
    async getAllFromFilter(filter, lastUsageFilter = null) {
        const leads = await this.leadModel.find(filter).exec();
        let pipe = leads;
        if (lastUsageFilter) {
            pipe = this.removeTodayUsedLeads(leads, lastUsageFilter);
        }
        return this.removeDuplicatedLeads(pipe);
    }
    async unsubscribe(id) {
        const unsub = { unsubscribed: true };
        const updated = await this.leadModel
            .findByIdAndUpdate(id, unsub, { new: true })
            .exec();
        if (updated) {
            await this.leadModel.updateMany({ email: { $eq: updated.email } }, unsub);
        }
        return updated;
    }
    async findLeadsByEmail(email) {
        const filter = {
            email: { $eq: email },
        };
        return this.leadModel.find(filter).exec();
    }
    async removeSegmentFromLeads(segmentId) {
        const leads = await this.leadModel
            .find({ segments: { $eq: segmentId } })
            .exec();
        if (!(0, lodash_1.get)(leads, 'length')) {
            return;
        }
        const promises = leads.map((lead) => {
            const segmentsId = lead.segments;
            const newSegments = segmentsId.filter((item) => item !== segmentId);
            return this.leadModel.findByIdAndUpdate(lead._id, {
                segments: newSegments,
            }, { new: true });
        });
        return Promise.all(promises);
    }
    setLeadsUsage(leads, field) {
        const promises = [];
        for (const lead of leads) {
            const { email } = lead;
            const lastUsage = Object.assign({}, lead.lastUsage);
            lastUsage[field] = luxon_1.DateTime.now().toFormat('yyyy-MM-dd');
            const data = {
                lastUsage,
            };
            promises.push(this.leadModel.updateMany({ email }, data, { new: true }).exec());
        }
        return Promise.all(promises);
    }
    async exportLeads(user, customer) {
        let leads = await this.findAllWithSegments(user, customer);
        leads = leads.map((lead) => {
            var _a, _b;
            return Object.assign(Object.assign({}, lead), { segmentString: (lead === null || lead === void 0 ? void 0 : lead.allSegments)
                    ? 'All segments'
                    : lead.segments.map((segment) => segment.name).join(', '), address1: (_a = lead === null || lead === void 0 ? void 0 : lead.address) === null || _a === void 0 ? void 0 : _a.address1, address2: (_b = lead === null || lead === void 0 ? void 0 : lead.address) === null || _b === void 0 ? void 0 : _b.address2 });
        });
        const fields = [
            { label: 'First Name', value: 'firstName' },
            { label: 'Last Name', value: 'lastName' },
            { label: 'Email', value: 'email' },
            { label: 'Member Email', value: 'customerEmail' },
            { label: 'Segments', value: 'segmentString' },
            { label: 'Phone number', value: 'phone' },
            { label: 'Date', value: 'createdAt' },
            { label: 'Address1', value: 'address1' },
            { label: 'Address2', value: 'address2' },
        ];
        const json2csv = new json2csv_1.Parser({ fields });
        return json2csv.parse(leads);
    }
    async getLeadCountByEmail(startDate, endDate, email, customer) {
        const filters = {
            $and: [
                {
                    createdAt: {
                        $gte: luxon_1.DateTime.fromISO(startDate).startOf('day'),
                        $lt: luxon_1.DateTime.fromISO(endDate).endOf('day'),
                    },
                },
                {
                    $or: [
                        { customerEmail: { $eq: email } },
                        { customer: { $eq: customer._id } },
                    ],
                },
            ],
        };
        return this.leadModel.find(filters).countDocuments().exec();
    }
    async fillWithInheritanceData(email, dto) {
        const existentBouncedLeadQuery = {
            $and: [
                { email: { $eq: email } },
                {
                    $or: [{ isValid: { $eq: false } }, { unsubscribed: { $eq: true } }],
                },
            ],
        };
        const existentBouncedLead = await this.leadModel
            .findOne(existentBouncedLeadQuery)
            .exec();
        if (existentBouncedLead) {
            dto['isValid'] = (0, lodash_1.get)(existentBouncedLead, 'isValid', false);
            dto['unsubscribed'] = (0, lodash_1.get)(existentBouncedLead, 'unsubscribed', true);
        }
        return dto;
    }
    async createFromPagestead(dto) {
        const errors = await (0, class_validator_1.validate)((0, class_transformer_1.plainToInstance)(create_lead_from_pagestead_dto_1.CreateLeadFromPagesteadDto, dto));
        const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
        requiredFields.forEach((field) => {
            if ((0, lodash_1.isEmpty)(dto[field]) || (0, lodash_1.isNull)(dto[field])) {
                dto[field] = field;
            }
        });
        if (errors.length) {
            dto = Object.assign(Object.assign({}, dto), { isValid: false });
        }
        return this.create(dto);
    }
    find(filter) {
        return this.leadModel.find(filter).exec();
    }
    async findCustomerDuplicatedLeads(customer, email, identities = []) {
        const filter = {
            $and: [
                {
                    $or: [
                        { customerEmail: { $in: identities } },
                        { customer: { $eq: customer._id } },
                    ],
                },
                { email: { $eq: email } },
            ],
        };
        return this.find(filter);
    }
    removeDuplicatedLeads(leads) {
        const emails = [];
        return leads.filter((lead) => {
            if (emails.find((email) => email === lead.email)) {
                return false;
            }
            emails.push(lead.email);
            return true;
        });
    }
    removeTodayUsedLeads(leads, field) {
        const todayDateString = luxon_1.DateTime.now().toFormat('yyyy-MM-dd');
        return leads.filter((item) => {
            return (0, lodash_1.get)(item, ['lastUsage', field]) !== todayDateString;
        });
    }
};
LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(lead_schema_1.Lead.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        segments_service_1.SegmentsService,
        customers_service_1.CustomersService])
], LeadsService);
exports.LeadsService = LeadsService;
//# sourceMappingURL=leads.service.js.map
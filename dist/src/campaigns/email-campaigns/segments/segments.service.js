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
exports.SegmentsService = void 0;
const cms_service_1 = require("../../../cms/cms/cms.service");
const lodash_1 = require("lodash");
const cms_filter_builder_1 = require("../../../internal/utils/cms/filters/cms.filter.builder");
const common_1 = require("@nestjs/common");
const leads_service_1 = require("../leads/leads.service");
const mongoose_1 = require("mongoose");
const webhook_1 = require("../../../cms/cms/types/webhook");
let SegmentsService = class SegmentsService {
    constructor(cmsService, leadsService) {
        this.cmsService = cmsService;
        this.leadsService = leadsService;
    }
    async list(queryFilter) {
        const { filters } = queryFilter;
        const name = (0, lodash_1.get)(filters, ['name']);
        const bookId = (0, lodash_1.get)(filters, ['bookId']);
        const ids = (0, lodash_1.get)(filters, ['ids']);
        const filterObjects = [];
        if (name) {
            filterObjects.push({
                name: 'name',
                operator: '$contains',
                value: name,
            });
        }
        if (bookId) {
            filterObjects.push({
                name: 'bookId',
                operator: '$eq',
                value: bookId,
            });
        }
        if ((0, lodash_1.get)(ids, 'length')) {
            filterObjects.push({
                name: 'id',
                operator: '$in',
                value: ids,
            });
        }
        const queryString = '?' + cms_filter_builder_1.CmsFilterBuilder.build(filterObjects);
        return this.cmsService.segmentsList(queryString);
    }
    async listById(queryFilter) {
        const { filters } = queryFilter;
        const ids = (0, lodash_1.get)(filters, ['ids']);
        const filterObjects = [];
        if ((0, lodash_1.get)(ids, 'length')) {
            filterObjects.push({
                name: 'id',
                operator: '$in',
                value: ids,
            });
        }
        const queryString = '?' + cms_filter_builder_1.CmsFilterBuilder.build(filterObjects);
        return this.cmsService.segmentsList(queryString);
    }
    async attachSegments(listT, segmentsId) {
        const uniqueSegmentsId = (0, lodash_1.uniq)(segmentsId);
        const filterSegments = {
            filters: {
                ids: uniqueSegmentsId,
            },
        };
        const segmentsList = await this.list(filterSegments);
        return (0, lodash_1.map)(listT, (itemT) => {
            const segments = (0, lodash_1.flatMap)(itemT === null || itemT === void 0 ? void 0 : itemT.segments, function (segmentId) {
                return segmentsList.filter((segmentObject) => segmentObject.id === segmentId);
            });
            const idProperty = (itemT === null || itemT === void 0 ? void 0 : itemT._id) ? '_id' : 'id';
            const object = itemT instanceof mongoose_1.Document ? itemT.toObject() : itemT;
            return Object.assign(Object.assign({ id: itemT[idProperty].toString() }, object), { segments });
        });
    }
    async listWithCustomerLeadsCount(customer, filters) {
        const list = await this.list(filters);
        const segmentsId = (0, lodash_1.map)(list, (item) => item.id);
        const filterObject = {
            isValid: { $eq: true },
            unsubscribed: { $eq: false },
            customerEmail: { $eq: customer.email },
            segments: { $in: segmentsId },
        };
        const leads = await this.leadsService.getAllFromFilter(filterObject);
        return (0, lodash_1.map)(list, (item) => {
            const filteredLeads = (0, lodash_1.filter)((0, lodash_1.map)(leads, (lead) => {
                if (lead.segments.includes(item.id)) {
                    return (0, lodash_1.get)(lead, '_id');
                }
            }));
            return Object.assign(Object.assign({}, item), { leads: filteredLeads });
        });
    }
    async handleWebhook(event) {
        if (event.model !== webhook_1.Models.SEGMENT) {
            return;
        }
        if (event.event === webhook_1.EventType.ENTRY_DELETE) {
            return this.leadsService.removeSegmentFromLeads(event === null || event === void 0 ? void 0 : event.entry.id);
        }
    }
};
SegmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => leads_service_1.LeadsService))),
    __metadata("design:paramtypes", [cms_service_1.CmsService,
        leads_service_1.LeadsService])
], SegmentsService);
exports.SegmentsService = SegmentsService;
//# sourceMappingURL=segments.service.js.map
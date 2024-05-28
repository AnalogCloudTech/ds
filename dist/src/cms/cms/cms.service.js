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
exports.CmsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const lodash_1 = require("lodash");
const routes_1 = require("./routes");
const common_2 = require("./types/common");
const cms_populate_builder_1 = require("../../internal/utils/cms/populate/cms.populate.builder");
const cms_filter_builder_1 = require("../../internal/utils/cms/filters/cms.filter.builder");
const paginator_1 = require("../../internal/utils/paginator");
const config_1 = require("@nestjs/config");
let CmsService = class CmsService {
    constructor(http, configService) {
        this.http = http;
        this.configService = configService;
    }
    async passthruGet(url) {
        return this.http.get(url);
    }
    templateListWithPagination(query = '') {
        return this.generalListWithPagination(routes_1.ROUTE_TEMPLATES_LIST, query);
    }
    async templateListDropdown() {
        const allItems = [];
        let page = 1;
        const perPage = 100;
        let goOn = true;
        do {
            const query = {
                fields: ['id', 'name', 'customerId'],
                publicationState: common_2.PublicationState.LIVE,
                pagination: {
                    page,
                    pageSize: perPage,
                },
            };
            const result = await this.templateListWithPagination(query);
            const { data, meta } = result;
            if (data) {
                data.forEach((item) => {
                    if (!(item === null || item === void 0 ? void 0 : item.customerId)) {
                        allItems.push(item);
                    }
                });
            }
            goOn = page !== (meta === null || meta === void 0 ? void 0 : meta.lastPage);
            page++;
        } while (goOn);
        return allItems;
    }
    async templateDetails(id, queryString = '?populate=*') {
        const query = this.validateQueryString(queryString);
        const template = await this.generalDetails(routes_1.ROUTE_TEMPLATES_DETAILS, id, query);
        if (!template) {
            return null;
        }
        const { bodyContent, content, createdAt, customerId, imageUrl, name, subject, templateTitle, } = template.attributes;
        return {
            bodyContent,
            content,
            createdAt,
            customerId,
            id,
            imageUrl,
            name,
            subject,
            templateTitle,
        };
    }
    async socialTemplatesList(queryString = '') {
        const query = this.validateQueryString(queryString);
        const pagination = await this.generalListWithPagination(routes_1.ROUTE_SOCIAL_MEDIA_TEMPLATES_LIST, query);
        const { data } = pagination;
        pagination.data = (0, lodash_1.map)(data, (template) => {
            return (0, lodash_1.pick)(template, ['id', 'name', 'subject', 'createdAt']);
        });
        return pagination;
    }
    async socialMediaTemplateDetails(id, queryString = '?populate=*') {
        const query = this.validateQueryString(queryString);
        const template = await this.generalDetails(routes_1.ROUTE_SOCIAL_MEDIA_TEMPLATES_DETAILS, id, query);
        const templateData = (0, lodash_1.pick)(template.attributes, [
            'name',
            'content',
            'subject',
            'templateTitle',
            'bodyContent',
            'imageUrl',
            'createdAt',
            'customerId',
        ]);
        const { image } = template.attributes;
        const imageUrl = (0, lodash_1.get)(image, ['data', 'attributes', 'url'], null);
        const queryStringSocial = {
            populate: {
                social_media: {
                    populate: {
                        socialMedia: '*',
                    },
                },
            },
        };
        try {
            const queryMedia = this.validateQueryString(queryStringSocial);
            const socialMediaDetail = await this.generalDetails(routes_1.ROUTE_SOCIAL_MEDIA_TEMPLATES_DETAILS, id, queryMedia);
            const socialMedia = (0, lodash_1.get)(socialMediaDetail, [
                'attributes',
                'social_media',
                'socialMedia',
                'data',
                'attributes',
                'name',
            ]);
            return Object.assign(Object.assign({}, templateData), { imageUrl,
                socialMedia });
        }
        catch (e) {
            throw new common_1.NotFoundException('Social Media not found');
        }
    }
    async socialMediaMultipleTemplateDetails(templateArray, queryString = '?populate=*') {
        const response = [];
        for (const id of templateArray) {
            const query = this.validateQueryString(queryString);
            const template = await this.generalDetails(routes_1.ROUTE_SOCIAL_MEDIA_TEMPLATES_DETAILS, id, query);
            const templateData = (0, lodash_1.pick)(template.attributes, [
                'name',
                'content',
                'subject',
                'createdAt',
            ]);
            templateData['id'] = template.id;
            const { image } = template.attributes;
            const imageUrl = (0, lodash_1.get)(image, ['data', 'attributes', 'url'], null);
            const queryStringSocial = {
                populate: {
                    social_media: {
                        populate: {
                            socialMedia: '*',
                        },
                    },
                },
            };
            const queryMedia = this.validateQueryString(queryStringSocial);
            const socialMediaDetail = await this.generalDetails(routes_1.ROUTE_SOCIAL_MEDIA_TEMPLATES_DETAILS, id, queryMedia);
            const socialMedia = (0, lodash_1.get)(socialMediaDetail, [
                'attributes',
                'social_media',
                'socialMedia',
                'data',
                'name',
            ]);
            response.push(Object.assign(Object.assign({}, templateData), { imageUrl,
                socialMedia }));
        }
        return response;
    }
    async segmentsList(queryString) {
        const data = await this.generalList(routes_1.ROUTE_SEGMENTS_LIST, queryString);
        return data.map((segment) => {
            const id = segment.id;
            const { name } = segment.attributes;
            return { id, name };
        });
    }
    async contentsList(queryString = '') {
        const data = await this.generalList(routes_1.ROUTE_CONTENTS_LIST, queryString);
        const contents = data.map((content) => {
            const id = content.id;
            const { name, emails } = content.attributes;
            const image = (0, lodash_1.get)(content, ['attributes', 'image', 'data', 'attributes', 'url'], '');
            return {
                id,
                name,
                image,
                numberOfEmails: (0, lodash_1.get)(emails, 'length'),
            };
        });
        return contents;
    }
    async socialMediaContentsList(queryString = '') {
        const query = this.validateQueryString(queryString);
        const pagination = await this.generalListWithPagination(routes_1.ROUTE_SOCIAL_MEDIA_CONTENTS_LIST, query);
        const { data } = pagination;
        pagination.data = data.map((content) => {
            const id = content.id;
            const { name, CampaignPost } = content;
            const image = (0, lodash_1.get)(content, ['image', 'data', 'attributes', 'url'], '');
            return {
                id,
                name,
                image,
                numberOfTemplates: (0, lodash_1.get)(CampaignPost, 'length', 0),
            };
        });
        return pagination;
    }
    async socialMediaContentsDetails(contentId) {
        const content = await this.socialMediaContentDetailsRaw(contentId);
        const id = content.id;
        const { name, CampaignPost } = content.attributes;
        const image = (0, lodash_1.get)(content, ['attributes', 'image', 'data', 'attributes', 'url'], '');
        return {
            id,
            name,
            image,
            campaignPost: (0, lodash_1.map)(CampaignPost, (template) => {
                return {
                    id: template.id,
                    name: template.name,
                    relativeDays: template.relativeDays,
                    absoluteDay: template.absoluteDay,
                    absoluteMonth: template.absoluteMonth,
                    content: (0, lodash_1.get)(template, ['template', 'data', 'attributes', 'content']),
                    templateName: (0, lodash_1.get)(template, [
                        'template',
                        'data',
                        'attributes',
                        'name',
                        'content',
                    ]),
                    image: (0, lodash_1.get)(template, [
                        'template',
                        'data',
                        'attributes',
                        'image',
                        'data',
                        'attributes',
                        'url',
                    ]),
                    socialMedia: (0, lodash_1.get)(template, [
                        'template',
                        'data',
                        'attributes',
                        'social_media',
                        'socialMedia',
                        'data',
                        'attributes',
                        'name',
                    ]),
                };
            }),
        };
    }
    async productPackages(queryString = '') {
        return this.generalList(routes_1.ROUTE_PAYMENT_PLANS, queryString);
    }
    async magazineData({ month, year }) {
        const populateFields = {
            populate: {
                displayImage: {
                    fields: ['name', 'url'],
                },
            },
        };
        const query = {
            populate: {
                pdf: { fields: ['name', 'url'] },
                previewPdf: { fields: ['name', 'url'] },
                frontCoverDesign: populateFields,
                frontCoverStrip: populateFields,
                frontInsideCover: populateFields,
                backInsideCover: populateFields,
                backCover: populateFields,
            },
            filters: {
                month: { $eq: month },
                year: { $eq: year },
            },
        };
        const queryString = `?${cms_populate_builder_1.CmsPopulateBuilder.build(query)}`;
        return this.generalList(routes_1.ROUTE_REFERRAL_MARKETING_MAGAZINE, queryString);
    }
    async contentDetailsRaw(contentId) {
        const query = {
            populate: {
                image: '*',
                emails: {
                    populate: {
                        template: {
                            populate: {
                                image: '*',
                                emailTemplates: '*',
                            },
                        },
                    },
                },
            },
        };
        const queryString = `?${cms_populate_builder_1.CmsPopulateBuilder.build(query)}`;
        return this.generalDetails(routes_1.ROUTE_CONTENTS_DETAILS, contentId, queryString);
    }
    socialMediaContentDetailsRaw(contentId) {
        const query = {
            populate: {
                image: '*',
                CampaignPost: {
                    populate: {
                        template: {
                            populate: {
                                image: '*',
                                social_media: { populate: '*' },
                            },
                        },
                    },
                },
            },
        };
        const queryString = `?${cms_populate_builder_1.CmsPopulateBuilder.build(query)}`;
        return this.generalDetails(routes_1.ROUTE_SOCIAL_MEDIA_CONTENTS_DETAILS, contentId, queryString);
    }
    async contentDetails(contentId) {
        const content = await this.contentDetailsRaw(contentId);
        const id = content.id;
        const { name, emails } = content.attributes;
        const image = (0, lodash_1.get)(content, ['attributes', 'image', 'data', 'attributes', 'url'], '');
        return {
            id,
            name,
            image,
            emails: (0, lodash_1.map)(emails, (email) => {
                return {
                    id: email.id,
                    name: email.name,
                    usesRelativeTime: email.usesRelativeTime,
                    relativeDays: email.relativeDays,
                    absoluteDay: email.absoluteDay,
                    absoluteMonth: email.absoluteMonth,
                    templateName: (0, lodash_1.get)(email, ['template', 'data', 'attributes', 'name']),
                    image: (0, lodash_1.get)(email, [
                        'template',
                        'data',
                        'attributes',
                        'image',
                        'data',
                        'attributes',
                        'url',
                    ]),
                };
            }),
        };
    }
    async allSegmentsExists(ids) {
        const filterObjects = [
            {
                name: 'id',
                operator: '$in',
                value: ids,
            },
        ];
        const queryString = `?${cms_filter_builder_1.CmsFilterBuilder.build(filterObjects)}`;
        const data = await this.generalList(routes_1.ROUTE_SEGMENTS_LIST, queryString);
        const areEqual = (0, lodash_1.get)(data, 'length') === (0, lodash_1.get)(ids, 'length');
        if (!areEqual) {
            throw new common_1.NotFoundException();
        }
    }
    async createTemplate(customer, templateData) {
        const data = Object.assign(Object.assign({}, templateData), { customerId: customer._id });
        return this.generalCreate(routes_1.ROUTE_TEMPLATES_CREATE, data);
    }
    async updateTemplate(templateId, templateData) {
        const route = (0, routes_1.replaceRouteParameter)(routes_1.ROUTE_TEMPLATES_UPDATE, ':id', templateId);
        return this.generalUpdate(route, templateData);
    }
    async deleteTemplate(templateId) {
        const route = (0, routes_1.replaceRouteParameter)(routes_1.ROUTE_TEMPLATES_DELETE, ':id', templateId);
        const response = await this.generalDelete(route);
        const { id } = response;
        return {
            id,
        };
    }
    async magazineDetails(magazineId, route = routes_1.ROUTE_REFERRAL_MARKETING_MAGAZINE + '/:id') {
        return this.generalDetails(route, +magazineId, '?populate=*');
    }
    healthCheck() {
        return this.http.get(routes_1.HEALTH_CHECK);
    }
    async generalDetails(route, entityId, queryString = '') {
        const url = (0, routes_1.replaceRouteParameter)(route, ':id', entityId) + queryString;
        const response = await this.http.get(url);
        return (0, lodash_1.get)(response, ['data', 'data']);
    }
    async generalCreate(route, data) {
        const response = await this.http.post(route, { data });
        return (0, lodash_1.get)(response, ['data', 'data']);
    }
    async generalUpdate(route, data) {
        const response = await this.http.put(route, { data });
        return (0, lodash_1.get)(response, ['data', 'data']);
    }
    async generalDelete(route) {
        const response = await this.http.delete(route);
        return (0, lodash_1.get)(response, ['data', 'data']);
    }
    async generalList(route, queryString = '') {
        const response = await this.http.get(`${route}${queryString}`);
        const hasData = (0, lodash_1.get)(response, ['data', 'data', 'length']);
        if (!hasData) {
            return [];
        }
        return (0, lodash_1.get)(response, ['data', 'data']);
    }
    async generalListWithPagination(route, query) {
        const queryString = this.validateQueryString(query);
        const response = await this.http.get(`${route}${queryString}`);
        const { data, meta } = response.data;
        const mappedData = (0, lodash_1.map)(data, (item) => {
            return Object.assign({ id: item.id }, item.attributes);
        });
        const total = (0, lodash_1.get)(meta, ['pagination', 'total'], 0);
        const perPage = (0, lodash_1.get)(meta, ['pagination', 'pageSize']);
        const currentPage = (0, lodash_1.get)(meta, ['pagination', 'page']) - 1;
        return paginator_1.PaginatorSchema.build(total, mappedData, currentPage, perPage);
    }
    validateQueryString(queryString) {
        return typeof queryString === 'string'
            ? queryString
            : `?${cms_populate_builder_1.CmsPopulateBuilder.build(queryString)}`;
    }
    async getUpgradePath(dto) {
        const ChargifyProductListId = await this.configService.get('cms.app_config_chargify_products_list_id');
        return this.getPlans(ChargifyProductListId, dto.bookId);
    }
    async getPlans(ChargifyProductListId, bookId) {
        const upgradePathDetails = [];
        const data = await this.generalDetails(routes_1.ROUTE_APP_CONFIG, ChargifyProductListId, '?populate=*');
        const result = (0, lodash_1.get)(data, ['attributes', 'value'], []).filter((product) => product.allowedBooks.indexOf(bookId.toString()) !== -1);
        result === null || result === void 0 ? void 0 : result.map((plan) => {
            const obj = {
                componentId: plan.id,
                componentName: plan.name,
                productHandle: plan.chargifyProductHandle,
            };
            upgradePathDetails.push(obj);
        });
        return {
            plans: upgradePathDetails,
        };
    }
    async getSocialMediaTrainingConfig() {
        const response = await this.generalListWithPagination(routes_1.ROUTE_SOCIAL_MEDIA_CONFIG, '?filters[key]=afy-ui');
        const appConfig = (0, lodash_1.first)(response.data);
        return appConfig.value.SOCIAL_MEDIA_TRAINING_PLANS;
    }
    async getUpgradeNowTermsConfig() {
        try {
            const response = await this.generalListWithPagination(routes_1.ROUTE_SOCIAL_MEDIA_CONFIG, '?filters[key]=UPGRADE_TERMS');
            const appConfig = (0, lodash_1.first)(response.data);
            return appConfig.value.html;
        }
        catch (error) {
            throw new common_1.HttpException({
                message: 'failed to load data from CMS',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getReferralMarketingPlans() {
        const response = await this.generalListWithPagination(routes_1.ROUTE_SOCIAL_MEDIA_CONFIG, '?filters[key]=afy-ui');
        const appConfig = (0, lodash_1.first)(response.data);
        return appConfig.value.RMM_MARKETING_PLANS;
    }
};
CmsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('HTTP_CMS')),
    __metadata("design:paramtypes", [axios_1.Axios,
        config_1.ConfigService])
], CmsService);
exports.CmsService = CmsService;
//# sourceMappingURL=cms.service.js.map
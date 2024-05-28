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
exports.CampaingsService = void 0;
const paginator_1 = require("../../../internal/utils/paginator");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lodash_1 = require("lodash");
const bull_1 = require("@nestjs/bull");
const campaigns_schema_1 = require("./schemas/campaigns.schema");
const constants_1 = require("./constants");
const cms_service_1 = require("../../../cms/cms/cms.service");
const attributes_schemas_1 = require("../attributes/schemas/attributes.schemas");
const common_helpers_1 = require("./helpers/common.helpers");
const axios_1 = require("axios");
const config_1 = require("@nestjs/config");
let CampaingsService = class CampaingsService {
    constructor(campaignModel, attributeModel, queue, cmsSerivces, commonHelper, configService, http) {
        this.campaignModel = campaignModel;
        this.attributeModel = attributeModel;
        this.queue = queue;
        this.cmsSerivces = cmsSerivces;
        this.commonHelper = commonHelper;
        this.configService = configService;
        this.http = http;
    }
    create(customer, createCampaingDto) {
        const data = Object.assign(Object.assign({}, createCampaingDto), { customerId: customer._id });
        const campaigns = new this.campaignModel(data);
        return campaigns.save();
    }
    async findAll(page, perPage) {
        const filterObject = {};
        const skip = page * perPage;
        const total = await this.campaignModel.find().countDocuments().exec();
        const campaignList = (await this.campaignModel
            .find(filterObject)
            .skip(skip)
            .limit(perPage)
            .exec()).map((item) => item);
        return paginator_1.PaginatorSchema.build(total, campaignList, page, perPage);
    }
    async findOne(id) {
        const campaignDetails = await this.campaignModel.findById(id);
        return campaignDetails;
    }
    async findAllByCustomerId(customer, page, perPage) {
        const filterObject = { customerId: customer.id };
        const skip = page * perPage;
        const total = await this.campaignModel
            .find(filterObject)
            .countDocuments()
            .exec();
        const campaignList = await this.campaignModel
            .find(filterObject)
            .skip(skip)
            .limit(perPage)
            .exec();
        return paginator_1.PaginatorSchema.build(total, campaignList, page, perPage);
    }
    update(id, updateCampaingDto) {
        return this.campaignModel
            .findByIdAndUpdate(id, updateCampaingDto, { new: true })
            .exec();
    }
    remove(id) {
        return this.campaignModel.findByIdAndDelete(id).exec();
    }
    getSMCampaigns() {
        return this.getSMCampaignsToSend();
    }
    addSMCampaignsIntoQueue(campaigns) {
        return this.queue.add(constants_1.SM_CAMPAIGN_QUEUE_NAME, campaigns, {
            removeOnComplete: true,
        });
    }
    addSMAttributesIntoQueue(attributes) {
        return this.queue.add(constants_1.SM_CAMPAIGN_QUEUE_NAME, attributes, {
            removeOnComplete: true,
        });
    }
    async getSMCampaignsToSend() {
        const templateIdArray = [];
        const list = await this.campaignModel.find().populate('customerId').exec();
        (0, lodash_1.each)(list, (value) => {
            if (templateIdArray.indexOf(value.contenId) === -1) {
                templateIdArray.push({
                    contentId: value.contenId,
                    customerId: value.customerId,
                });
            }
        });
        (0, lodash_1.each)(templateIdArray, (result) => {
            this.cmsSerivces
                .socialMediaContentsDetails(result.contentId)
                .then((campaignResult) => {
                (0, lodash_1.each)(campaignResult['campaignPost'], async (data) => {
                    const getAttributes = await this.getSMAttributes(data.socialMedia);
                    const currentDate = new Date();
                    const month = currentDate.getMonth() + 1;
                    const date = currentDate.getDate();
                    if (month == data.absoluteMonth && date == data.absoluteDay) {
                        await this.commonHelper.postFBMessage(data, getAttributes);
                    }
                });
            })
                .catch((error) => {
                var _a, _b;
                common_1.Logger.error(`Customer ${result.customerId._id} `, (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message);
            });
        });
        return list;
    }
    getSMAttributes(socialMedia) {
        return this.attributeModel.find({
            mediaType: socialMedia,
        });
    }
    async updateFBToken(attributes) {
        (0, lodash_1.each)(attributes, async (attrResult) => {
            if (attrResult.pageAddress &&
                attrResult.secretKey &&
                attrResult.securityKey) {
                const params = {
                    grant_type: this.configService.get('facebookToken.grantType'),
                    redirect_uri: this.configService.get('facebookToken.redirectUrl'),
                    client_id: `${attrResult.pageAddress}`,
                    client_secret: `${attrResult.secretKey}`,
                    fb_exchange_token: `${attrResult.securityKey}`,
                };
                return this.http
                    .get('', {
                    params,
                })
                    .then(async (updatedToken) => {
                    await this.attributeModel.findOneAndUpdate({
                        customer_id: attrResult.customer_id,
                    }, {
                        securityKey: updatedToken.data.access_token,
                    }, { new: true });
                })
                    .catch((error) => {
                    common_1.Logger.error('error', error);
                });
            }
        });
    }
};
CampaingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(campaigns_schema_1.Campaigns.name)),
    __param(1, (0, mongoose_1.InjectModel)(attributes_schemas_1.Attribute.name)),
    __param(2, (0, bull_1.InjectQueue)(constants_1.SEND_SM_CAMPAIGN_QUEUE_PROCESSOR)),
    __param(6, (0, common_1.Inject)('HTTP_FACEBOOK')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model, Object, cms_service_1.CmsService,
        common_helpers_1.CommonHelpers,
        config_1.ConfigService,
        axios_1.Axios])
], CampaingsService);
exports.CampaingsService = CampaingsService;
//# sourceMappingURL=campaings.service.js.map
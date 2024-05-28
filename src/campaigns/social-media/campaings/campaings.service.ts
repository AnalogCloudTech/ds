import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bull';
import { Model } from 'mongoose';
import { each } from 'lodash';
import { InjectQueue } from '@nestjs/bull';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaigns, CampaignsDocument } from './schemas/campaigns.schema';
import {
  SEND_SM_CAMPAIGN_QUEUE_PROCESSOR,
  SM_CAMPAIGN_QUEUE_NAME,
} from './constants';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CmsService } from '@/cms/cms/cms.service';
import {
  Attribute,
  AttributesDocument,
} from '../attributes/schemas/attributes.schemas';
import { CommonHelpers } from './helpers/common.helpers';
import { Axios } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CampaingsService {
  constructor(
    @InjectModel(Campaigns.name)
    private readonly campaignModel: Model<CampaignsDocument>,
    @InjectModel(Attribute.name)
    private readonly attributeModel: Model<AttributesDocument>,
    @InjectQueue(SEND_SM_CAMPAIGN_QUEUE_PROCESSOR)
    private readonly queue: Queue,
    private cmsSerivces: CmsService,
    private commonHelper: CommonHelpers,
    private readonly configService: ConfigService,
    @Inject('HTTP_FACEBOOK') private readonly http: Axios,
  ) {}

  create(customer: CustomerDocument, createCampaingDto: CreateCampaignDto) {
    const data = {
      ...createCampaingDto,
      customerId: customer._id,
    };
    const campaigns = new this.campaignModel(data);
    return campaigns.save();
  }

  async findAll(
    page: number,
    perPage: number,
  ): Promise<PaginatorSchematicsInterface> {
    const filterObject: object = {};
    const skip = page * perPage;
    const total = await this.campaignModel.find().countDocuments().exec();
    const campaignList = (
      await this.campaignModel
        .find(filterObject)
        .skip(skip)
        .limit(perPage)
        .exec()
    ).map((item: CampaignsDocument) => item);
    return PaginatorSchema.build(total, campaignList, page, perPage);
  }

  async findOne(id: string): Promise<CampaignsDocument> {
    const campaignDetails = await this.campaignModel.findById(id);
    return campaignDetails;
  }

  async findAllByCustomerId(
    customer: CustomerDocument,
    page: number,
    perPage: number,
  ): Promise<PaginatorSchematicsInterface> {
    const filterObject: object = { customerId: customer.id };
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
    return PaginatorSchema.build(total, campaignList, page, perPage);
  }

  update(
    id: string,
    updateCampaingDto: UpdateCampaignDto,
  ): Promise<CampaignsDocument> {
    return this.campaignModel
      .findByIdAndUpdate(id, updateCampaingDto, { new: true })
      .exec();
  }

  remove(id: string): Promise<CampaignsDocument> {
    return this.campaignModel.findByIdAndDelete(id).exec();
  }

  getSMCampaigns() {
    return this.getSMCampaignsToSend();
  }

  addSMCampaignsIntoQueue(campaigns: CampaignsDocument[]) {
    return this.queue.add(SM_CAMPAIGN_QUEUE_NAME, campaigns, {
      removeOnComplete: true,
    });
  }

  addSMAttributesIntoQueue(attributes: AttributesDocument[]) {
    return this.queue.add(SM_CAMPAIGN_QUEUE_NAME, attributes, {
      removeOnComplete: true,
    });
  }

  async getSMCampaignsToSend() {
    const templateIdArray = [];
    const list = await this.campaignModel.find().populate('customerId').exec();
    each(list, (value) => {
      if (templateIdArray.indexOf(value.contenId) === -1) {
        templateIdArray.push({
          contentId: value.contenId,
          customerId: value.customerId,
        });
      }
    });
    each(templateIdArray, (result) => {
      this.cmsSerivces
        .socialMediaContentsDetails(result.contentId)
        .then((campaignResult) => {
          each(campaignResult['campaignPost'], async (data) => {
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
          Logger.error(
            `Customer ${result.customerId._id} `,
            error.response?.error?.message,
          );
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
    each(attributes, async (attrResult) => {
      if (
        attrResult.pageAddress &&
        attrResult.secretKey &&
        attrResult.securityKey
      ) {
        const params = {
          grant_type: this.configService.get<string>('facebookToken.grantType'),
          redirect_uri: this.configService.get<string>(
            'facebookToken.redirectUrl',
          ),
          client_id: `${attrResult.pageAddress}`,
          client_secret: `${attrResult.secretKey}`,
          fb_exchange_token: `${attrResult.securityKey}`,
        };
        return this.http
          .get('', {
            params,
          })
          .then(async (updatedToken) => {
            await this.attributeModel.findOneAndUpdate(
              {
                customer_id: attrResult.customer_id,
              },
              {
                securityKey: updatedToken.data.access_token,
              },
              { new: true },
            );
          })
          .catch((error) => {
            Logger.error('error', error);
          });
      }
    });
  }

  async handleCampaignsCron() {
    const campaigns = await this.getSMCampaigns();
    return this.addSMCampaignsIntoQueue(campaigns);
  }

  async handleAttributesCron() {
    const attributes = await this.getSMAttributes('facebook');
    return await this.updateFBToken(attributes);
  }
}

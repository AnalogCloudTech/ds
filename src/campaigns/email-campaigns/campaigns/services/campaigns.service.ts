import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ObjectId, UpdateQuery } from 'mongoose';
import { each, get, map } from 'lodash';

import {
  CreateCampaignDto,
  UpdateCampaignDto,
  UpdateCampaignStatusDto,
} from '../dto/campaign.dto';
import { Campaign, CampaignDocument } from '../schemas/campaign.schema';
import { Campaign as DomainCampaign } from '../domain/campaign';
import {
  Paginator,
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import {
  CampaignHandler,
  CampaignReport,
  CampaignsAggregationBuckets,
  CampaignsMetrics,
  CampaignStatus,
  CampaignTotalsCount,
  CampaignWithSegments,
  EmailMetrics,
} from '@/campaigns/email-campaigns/campaigns/domain/types';
import { ContentsService } from '@/campaigns/email-campaigns/contents/contents.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { SegmentsService } from '@/campaigns/email-campaigns/segments/segments.service';
import {
  CampaignHistory,
  CampaignHistoryDocument,
} from '@/campaigns/email-campaigns/campaigns/schemas/campaign-history.schema';
import { CampaignRepository } from '@/campaigns/email-campaigns/campaigns/repositories/campaign.repository';
import { SchemaId } from '@/internal/types/helpers';
import { EmailHistoryService } from '@/campaigns/email-campaigns/email-history/email-history.service';
import { TemplatesService } from '@/campaigns/email-campaigns/templates/templates.service';
import { AnalyticsService } from '@/legacy/dis/legacy/analytics/analytics.service';
import { Segment } from '@/campaigns/email-campaigns/segments/domain/segment';
import { AfyNotificationsService } from '@/integrations/afy-notifications/afy-notifications.service';
import { CampaignMetricsQueryParams } from '@/campaigns/email-campaigns/campaigns/dto/campaign-metrics-query-params.dto';
import { DateTime } from 'luxon';
import { formatMetrics } from '@/internal/utils/csv-formats/email-metrics';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CSV_UPLOADER_QUEUE } from '@/campaigns/email-campaigns/constants';
import { CampaignMetricsExportParams } from '@/campaigns/email-campaigns/campaigns/dto/campaign-metrics-export-params.dto';
import { LoggerPayload } from '@/internal/utils/logger';
import { CONTEXT_EMAIL_CAMPAIGNS_DEBUG } from '@/internal/common/contexts';
import { SendCampaignsService } from '@/campaigns/email-campaigns/campaigns/services/send-campaigns.service';

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);

  constructor(
    @InjectModel(Campaign.name)
    private readonly campaignModel: Model<CampaignDocument>,
    @InjectModel(CampaignHistory.name)
    private readonly campaignHistoryModel: Model<CampaignHistoryDocument>,
    private readonly contentsService: ContentsService,
    private readonly segmentsService: SegmentsService,
    private readonly campaignRepository: CampaignRepository,
    private readonly emailHistoryService: EmailHistoryService,
    @Inject(forwardRef(() => TemplatesService))
    private readonly templatesService: TemplatesService,
    private readonly analyticsService: AnalyticsService,
    private readonly notificationsService: AfyNotificationsService,
    @InjectQueue(CSV_UPLOADER_QUEUE) private csvUploaderQueue: Queue,
    private readonly sendCampaignsService: SendCampaignsService,
  ) {}

  async getCampaigns(
    customer: CustomerDocument,
    page: number,
    perPage: number,
  ): Promise<PaginatorSchematicsInterface> {
    const customerId = customer._id;
    const total = await this.campaignModel
      .find({ customer: customerId })
      .countDocuments()
      .exec();
    const skip = page * perPage;
    const data = await this.campaignModel
      .find({ customer: customerId })
      .sort({ createdAt: 'desc' })
      .skip(skip)
      .limit(perPage)
      .exec();

    const segmentsId: Array<number> = [];
    const promises: Promise<any>[] = data.map(
      async (item: CampaignDocument) => {
        each(item.segments, (segmentId: number) => segmentsId.push(segmentId));
        const content = await this.contentsService.details(item.contentId);
        const numberOfEmails = get(content, ['emails', 'length'], 0);
        return {
          ...item.castTo(DomainCampaign),
          numberOfEmails,
          content,
        };
      },
    );

    const castedData = await Promise.all(promises);
    const campaignWithSegments = await this.segmentsService.attachSegments(
      castedData,
      segmentsId,
    );

    return PaginatorSchema.build(total, campaignWithSegments, page, perPage);
  }

  async createCampaign(
    customer: CustomerDocument,
    dto: CreateCampaignDto,
  ): Promise<CampaignDocument> {
    const content = await this.contentsService.detailsRaw(dto.contentId);
    const templateIds = map(get(content, ['attributes', 'emails']), (email) => {
      return get(email, ['template', 'data', 'id']);
    });

    const data = {
      ...dto,
      customer: customer._id,
      templateIds,
    };

    return this.campaignRepository.store<CreateCampaignDto>(data);
  }

  async update(id: SchemaId, dto: UpdateQuery<Partial<Campaign>>) {
    return this.campaignRepository.update(id, dto);
  }

  async updateCampaign(id: SchemaId, dto: UpdateCampaignDto) {
    return this.campaignRepository.update(id, dto);
  }

  async updateCampaignStatus(id: SchemaId, dto: UpdateCampaignStatusDto) {
    return this.campaignRepository.update(id, dto);
  }

  async getCampaign(customer: CustomerDocument, id: SchemaId) {
    const campaign = await this.campaignModel
      .findOne({ customer: { $eq: customer._id }, _id: { $eq: id } })
      .exec();

    const content = await this.contentsService.details(campaign.contentId);
    const numberOfEmails = get(content, ['emails', 'length'], 0);

    return {
      ...campaign.castTo(DomainCampaign),
      numberOfEmails,
      content,
    };
  }

  async deleteCampaign(id: SchemaId) {
    return this.campaignRepository.delete(id);
  }

  async getCustomerCampaignsByContent(
    customer: CustomerDocument,
    contentsId: Array<number>,
  ): Promise<Array<CampaignDocument>> {
    const query: FilterQuery<CampaignDocument> = {
      customer: customer._id,
      contentId: { $in: contentsId },
    };
    return this.campaignRepository.findAll(query);
  }

  /**
   * @deprecated remove in the next release
   * @param messageId
   */
  async findByMessageId(messageId: string): Promise<CampaignDocument> {
    const filter = {
      messageIds: { $in: messageId },
    };
    return this.campaignModel.findOne(filter).exec();
  }

  async cancelCampaignsByTemplateId(templateId: number): Promise<void> {
    const campaigns: Array<CampaignDocument> = await this.campaignModel
      .find({ templateIds: { $eq: templateId } })
      .exec();

    const promises = map(campaigns, (campaign) => {
      return this.campaignModel.findByIdAndUpdate(
        get(campaign, '_id'),
        {
          status: CampaignStatus.CANCELED,
        },
        { new: true },
      );
    });

    await Promise.all(promises);
  }

  async canBeChanged(campaignId: string): Promise<boolean> {
    try {
      const campaign = await this.campaignModel.findById(campaignId);
      return campaign.status !== CampaignStatus.CANCELED;
    } catch (exception) {
      return false;
    }
  }

  public async getCampaignHistory(
    campaign: ObjectId,
  ): Promise<Array<CampaignHistoryDocument>> {
    return this.campaignHistoryModel
      .find({ campaign })
      .populate('campaign')
      .exec();
  }

  public async getCampaignHistorySerialized(campaign: ObjectId) {
    const history = await this.getCampaignHistory(campaign);
    return history.map((item) => this.serializeHistory(item));
  }

  private serializeHistory(campaignHistory: CampaignHistoryDocument) {
    const { name: campaignName } = <CampaignDocument>campaignHistory.campaign;
    const { templateNames, type, messageIds } = campaignHistory;
    return {
      id: campaignHistory._id,
      campaignName,
      templateNames,
      messageIds,
      type,
      createdAt: get(campaignHistory, 'createdAt'),
    };
  }

  public async getById(id: string): Promise<CampaignDocument> {
    return this.campaignModel.findById(id).populate(['customer']).exec();
  }

  async getAllHistoryCampaigns(
    customer: CustomerDocument,
    page = 0,
    perPage = 15,
  ): Promise<PaginatorSchematicsInterface<CampaignHistoryDocument>> {
    const customerId = customer._id;

    const campaigns = await this.campaignModel
      .find({ customer: customerId })
      .exec();

    const query: FilterQuery<CampaignHistoryDocument> = {
      campaign: {
        $in: campaigns.map((campaign) => campaign._id),
      },
    };

    const total = await this.campaignHistoryModel.countDocuments(query).exec();
    const skip = page * perPage;

    const history = await this.campaignHistoryModel
      .find(query)
      .populate(['campaign'])
      .limit(perPage)
      .sort({ createdAt: 'desc' })
      .skip(skip)
      .exec();

    return PaginatorSchema.build<CampaignHistoryDocument>(
      total,
      history,
      page,
      perPage,
    );
  }

  async getEmailCampaignMetrics(
    page = 0,
    perPage = 15,
    startDate: string,
    endDate: string,
  ): Promise<CampaignsMetrics> {
    const campaignsFilters = <FilterQuery<CampaignDocument>>{
      status: CampaignStatus.ACTIVE,
    };
    return this.getCampaignMetrics(
      campaignsFilters,
      startDate,
      endDate,
      page,
      perPage,
    );
  }

  async findCampaignHistoryByMessageId(
    messageId: string,
  ): Promise<CampaignHistoryDocument | null> {
    const filter: FilterQuery<CampaignHistoryDocument> = {
      messageIds: { $in: messageId },
    };
    return this.campaignHistoryModel.findOne(filter).exec();
  }

  async getEmailCampaignMetricsForMember(
    customer: CustomerDocument,
    page = 0,
    perPage = 15,
    startDate: string,
    endDate: string,
  ): Promise<CampaignsMetrics> {
    const campaignsFilters = <FilterQuery<CampaignDocument>>{
      customer: customer._id,
      status: CampaignStatus.ACTIVE,
    };
    return this.getCampaignMetrics(
      campaignsFilters,
      startDate,
      endDate,
      page,
      perPage,
    );
  }

  async getMetrics(
    options: CampaignMetricsQueryParams &
      Omit<Paginator, 'sortBy' | 'sortOrder'>,
    campaigns: CampaignDocument[],
  ) {
    const start = options.start
      ? DateTime.fromJSDate(options.start)
      : DateTime.local().minus({ day: 30 });
    const end = options.end
      ? DateTime.fromJSDate(options.end)
      : DateTime.local();

    const { perPage, page } = options;

    const dateDiff = start.diff(end, 'days').toObject();
    const previousStart = start
      .minus({ day: Math.abs(dateDiff.days) })
      .toISODate();
    const previousEnd = start.minus({ day: 1 }).toISODate();

    const [campaignMetricsCurrent, campaignMetricsPrevious] = await Promise.all(
      [
        this.getEmailData(campaigns, start.toISODate(), end.toISODate()),
        this.getEmailData(campaigns, previousStart, previousEnd),
      ],
    );

    // TODO: refactor
    const totalCurrent = campaignMetricsCurrent.reduce(
      (acc, cur) => {
        Object.entries(cur.metricsMeta).forEach(([key, value]) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          acc[key] = (acc[key] || 0) + value;
        });
        return acc;
      },
      {
        Send: 0,
        Open: 0,
        Click: 0,
        Bounce: 0,
        Complaint: 0,
        Delivery: 0,
      },
    );

    const totalPrevious = campaignMetricsPrevious.reduce(
      (acc, cur) => {
        Object.entries(cur.metricsMeta).forEach(([key, value]) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          acc[key] = (acc[key] || 0) + value;
        });
        return acc;
      },
      {
        Send: 0,
        Open: 0,
        Click: 0,
        Bounce: 0,
        Complaint: 0,
        Delivery: 0,
      },
    );

    return {
      data: campaignMetricsCurrent,
      total: {
        current: totalCurrent,
        previous: totalPrevious,
      },
      meta: {
        page,
        perPage,
        total: campaigns.length,
      },
    };
  }

  async emailMetrics(
    customer: CustomerDocument,
    options: CampaignMetricsQueryParams &
      Omit<Paginator, 'sortBy' | 'sortOrder'>,
  ) {
    const { perPage, page } = options;

    const query = {
      status: CampaignStatus.ACTIVE,
      customer: customer._id,
    };

    if (options.textSearch) {
      query['$or'] = [
        { name: { $regex: new RegExp(options.textSearch), $options: 'i' } },
        // TODO: we are not storing segments and templates in documents so ignoring this for now
        // template: { $regex: options.textSearch, $options: 'i' },
        // segments: { $regex: options.textSearch, $options: 'i' },
      ];
    }

    const campaigns = await this.campaignRepository.findAll(query, {
      skip: page * perPage,
      limit: perPage,
      sort: options.sortBy,
      collation: {
        locale: 'en',
        caseLevel: false,
      },
    });

    return this.getMetrics(options, campaigns);
  }

  async enqueueEmailMetricsJob(
    customer: CustomerDocument,
    options: CampaignMetricsExportParams,
  ) {
    const campaignIds = options.campaignIds;
    const bucket = options.bucket;

    const formattedData = [];
    // We loop though each campaign to make sure we make a separate CSV each campaign
    for (const campaignId of campaignIds) {
      const campaign = await this.campaignRepository.findById(campaignId);
      const metrics = await this.getMetrics(options, [campaign]);
      const data = formatMetrics(<EmailMetrics>metrics);
      formattedData.push({
        campaignId,
        data,
      });
    }

    const jobData = {
      formattedData,
      customer,
      email: options.email,
      bucket,
    };
    const opts = { removeOnComplete: true };
    await this.csvUploaderQueue.add(jobData, opts);

    return true;
  }

  private async getEmailData(
    campaigns: CampaignDocument[],
    start: string,
    end: string,
  ) {
    return Promise.all(
      campaigns.map(async (campaign) => {
        const {
          _id: campaignId,
          messageIds,
          name,
          segments,
          allSegments,
          status,
          startDate,
          allowWeekend,
          contentId,
          createdAt,
          updatedAt,
        } = campaign;

        if (!messageIds) {
          return {};
        }

        const [metrics, segmentDetails] = await Promise.all([
          this.notificationsService.getEmailMetrics(
            messageIds.filter((id) => id),
            start,
            end,
          ),
          this.segmentsService.listById({
            filters: { ids: segments },
          }),
        ]);

        return {
          metrics: metrics.data,
          metricsMeta: metrics.meta,
          campaign: {
            id: campaignId,
            name,
            segments: segmentDetails,
            allSegments,
            status,
            startDate,
            allowWeekend,
            contentId,
            createdAt,
            updatedAt,
          },
        };
      }),
    );
  }

  private async getCampaignMetrics(
    campaignsFilters: FilterQuery<CampaignDocument>,
    startDate: string,
    endDate: string,
    page: number,
    perPage: number,
  ): Promise<CampaignsMetrics> {
    const campaigns = await this.campaignModel.find(
      campaignsFilters,
      {
        _id: 1,
        name: 1,
        segments: 1,
        allSegments: 1,
        status: 1,
        customer: 1,
      },
      {
        populate: { path: 'customer', select: ['firstName', 'lastName'] },
      },
    );

    const segments: Array<number> = campaigns
      .map((campaign) => campaign.segments)
      .flat();
    const campaignsWithSegments = await this.segmentsService.attachSegments<
      CampaignDocument,
      CampaignWithSegments
    >(campaigns, segments);

    const query: FilterQuery<CampaignHistoryDocument> = {
      campaign: {
        $in: campaigns.map((campaign) => campaign._id),
      },
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    };

    const total = await this.campaignHistoryModel.countDocuments(query).exec();
    const skip = page * perPage;

    const history = await this.campaignHistoryModel
      .find(query, {
        _id: 1,
        campaign: 1,
        messageIds: 1,
        templateNames: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .limit(perPage)
      .sort({ updatedAt: 'desc', createdAt: 'desc' })
      .skip(skip)
      .exec();

    let historyPopulated: Array<CampaignReport> = [];
    const messageIds: Array<string> = [];
    // @TODO campaigns doesn't using SchemaId yet.
    const campaignsMap = new Map<string, CampaignWithSegments>();
    campaignsWithSegments.forEach((campaign) =>
      campaignsMap.set(campaign._id.toString(), campaign),
    );

    for (const hist of history) {
      const campaign = campaignsMap.get(hist.campaign.toString());

      // removing null, empty and undefined messageIds
      messageIds.push(...hist.messageIds.filter((item) => item));

      historyPopulated.push(<CampaignReport>{
        ...hist.toObject(),
        name: campaign.name,
        segments: campaign.allSegments
          ? [<Segment>{ id: null, name: 'All Segments' }]
          : campaign.segments,
        status: campaign.status,
        customer: <Pick<CustomerDocument, '_id' | 'firstName' | 'lastName'>>(
          campaign.customer
        ),
        totalSent: 0,
        totalDelivery: 0,
        totalBounce: 0,
        totalComplaints: 0,
      });
    }

    const uniqueMessageIds = Array.from(new Set(messageIds));

    // @TODO from here I'll ignore the types, because analytics module need a huge refactoring, and this will be temporary
    const elasticResults =
      await this.analyticsService.getEmailHistoryByMessageIds(uniqueMessageIds);

    const hits = elasticResults?.hits?.hits;
    const buckets = <CampaignsAggregationBuckets>(
      elasticResults?.aggregations?.eventTypes?.buckets
    );

    historyPopulated = historyPopulated.map((hist) => {
      const emailHistory = hits?.filter((hit) => {
        return (
          hist.messageIds.indexOf(hit?._source?.rawData?.mail?.messageId) > -1
        );
      });

      emailHistory?.forEach((hit) => {
        switch (hit?._source?.rawData?.eventType) {
          case 'Send':
            hist.totalSent++;
            break;
          case 'Delivery':
            hist.totalDelivery++;
            break;
          case 'Bounce':
            hist.totalBounce++;
            break;
          case 'Complaint':
            hist.totalComplaints++;
            break;
        }
      });

      return hist;
    });

    const totals: CampaignTotalsCount = {
      delivery: Number(
        buckets?.find((bucket) => bucket.key === 'Delivery')?.doc_count ?? 0,
      ),
      bounce: Number(
        buckets?.find((bucket) => bucket.key === 'Bounce')?.doc_count ?? 0,
      ),
      unsubscribed: Number(
        buckets?.find((bucket) => bucket.key === 'Complaints')?.doc_count ?? 0,
      ),
      total: Number(
        buckets?.find((bucket) => bucket.key === 'Send')?.doc_count ?? 0,
      ),
    };

    // @TODO until here

    const historyPaginated = PaginatorSchema.build<CampaignReport>(
      total,
      historyPopulated,
      page,
      perPage,
    );

    return <CampaignsMetrics>{
      campaigns: campaigns.length,
      history: historyPaginated,
      totals,
    };
  }

  async handleCampaigns() {
    this.logger.log(
      {
        payload: <LoggerPayload>{
          usageDate: DateTime.now(),
          message: 'handleCampaigns@start',
        },
      },
      CONTEXT_EMAIL_CAMPAIGNS_DEBUG,
    );

    const campaigns = await this.sendCampaignsService.getCampaignsToBeSent();

    this.logger.log(
      {
        payload: <LoggerPayload>{
          usageDate: DateTime.now(),
          message: `Found ${get(campaigns, 'length', 0)} campaigns to be sent`,
          campaigns: map(campaigns, (campaign) => campaign._id),
        },
      },
      CONTEXT_EMAIL_CAMPAIGNS_DEBUG,
    );

    await this.sendCampaignsService.sendAllCampaignsByHandler(
      campaigns,
      CampaignHandler.ABSOLUTE,
    );

    await this.sendCampaignsService.sendAllCampaignsByHandler(
      campaigns,
      CampaignHandler.RELATIVE,
    );

    this.logger.log(
      {
        payload: <LoggerPayload>{
          usageDate: DateTime.now(),
          message: 'handleCampaigns@end',
        },
      },
      CONTEXT_EMAIL_CAMPAIGNS_DEBUG,
    );
  }

  countEmailsBySender(emailAddress: string) {
    return this.notificationsService.countEmailsBySender(emailAddress);
  }
}

import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateOnDemandEmailDto } from './dto/create-on-demand-email.dto';
import { UpdateOnDemandEmailDto } from './dto/update-on-demand-email.dto';
import {
  OnDemandEmail,
  OnDemandEmailDocument,
} from './schemas/on-demand-email.schema';
import { Statuses } from '@/campaigns/email-campaigns/on-demand-emails/domain/types';
import { utcTimestampISO8601 } from 'aws-sdk/clients/frauddetector';
import { DateTime } from 'luxon';
import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { TemplatesService } from '@/campaigns/email-campaigns/templates/templates.service';
import { MessageId } from 'aws-sdk/clients/ses';
import {
  Lead,
  LeadDocument,
} from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
import { LeadsService } from '@/campaigns/email-campaigns/leads/leads.service';
import { SegmentsService } from '@/campaigns/email-campaigns/segments/segments.service';
import { SegmentQueryFilters } from '@/campaigns/email-campaigns/segments/types';
import { Segment } from '@/campaigns/email-campaigns/segments/domain/segment';
import { UsageFields } from '@/campaigns/email-campaigns/leads/domain/types';
import { chunk, each, get, map } from 'lodash';
import { SES } from 'aws-sdk';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import {
  buildCustomerTemplateName,
  buildTemplateName,
} from '@/internal/libs/aws/ses/constants';
import { EmailHistoryService } from '@/campaigns/email-campaigns/email-history/email-history.service';
import { RelationTypes } from '@/campaigns/email-campaigns/email-history/schemas/types';
import { CreateFromEmailCampaignsDto } from '@/campaigns/email-campaigns/email-history/dto/create-from-email-campaigns.dto';
import {
  CONTEXT_ON_DEMAND_EMAIL,
  CONTEXT_ON_DEMAND_EMAIL_ERROR,
} from '@/internal/common/contexts';
import { SchemaId } from '@/internal/types/helpers';
import { buildFilterQueryForCampaignLeads } from '@/campaigns/email-campaigns/leads/utils/filters';
import { LoggerPayload } from '@/internal/utils/logger';
import {
  AfyNotificationsService,
  EmailMessage,
} from '@/integrations/afy-notifications/afy-notifications.service';
import { CheckStatusOfEmailMessageException } from '@/integrations/afy-notifications/exceptions/check-status-of-email-message.exception';
import { replaceTagsOnDemandEmails } from '@/internal/utils/aws/ses/replaceTags';

@Injectable()
export class OnDemandEmailsService {
  constructor(
    @InjectModel(OnDemandEmail.name)
    private readonly onDemandEmailModel: Model<OnDemandEmailDocument>,
    @Inject(forwardRef(() => TemplatesService))
    private readonly templatesService: TemplatesService,
    private readonly leadsService: LeadsService,
    private readonly segmentsService: SegmentsService,
    private readonly sesService: SesService,
    @Inject(forwardRef(() => EmailHistoryService))
    private readonly emailHistoryService: EmailHistoryService,
    private readonly logger: Logger,
    private readonly afyNotificationsService: AfyNotificationsService,
  ) {}

  async create(
    customer: CustomerDocument,
    createOnDemandEmailDto: CreateOnDemandEmailDto,
  ) {
    const template = await this.templatesService.templateDetails(
      createOnDemandEmailDto.templateId,
    );

    const dto = {
      ...createOnDemandEmailDto,
      customer: customer._id,
      templateName: template.name,
    };

    const createdOnDemandEmail = new this.onDemandEmailModel(dto);
    const item = await createdOnDemandEmail.save();

    return item;
  }

  async findAll(user: { email: string }) {
    const userEmail = user.email;
    const query = this.onDemandEmailModel.find({
      customerEmail: { $eq: userEmail },
    });

    return query.exec();
  }

  async findAllPaginated(
    customer: CustomerDocument,
    page: number,
    perPage: number,
  ): Promise<PaginatorSchematicsInterface> {
    const total = await this.onDemandEmailModel
      .find({ customer: { $eq: customer._id } })
      .countDocuments()
      .exec();

    const data: OnDemandEmailDocument[] = await this.onDemandEmailModel
      .find({ customer: { $eq: customer._id } })
      .sort({ createdAt: -1 })
      .exec();

    const segmentsId: Array<number> = [];
    each(data, (item: OnDemandEmailDocument) => {
      each(item.segments, (segmentId: number) => segmentsId.push(segmentId));
    });

    const dataWithSegments = await this.segmentsService.attachSegments(
      data,
      segmentsId,
    );

    return PaginatorSchema.build(total, dataWithSegments, page, perPage);
  }

  async findOneByUser(
    customer: CustomerDocument,
    id: string,
  ): Promise<OnDemandEmailDocument> {
    const onDemandEmail = await this.onDemandEmailModel
      .findOne({
        _id: { $eq: id },
        customer: { $eq: customer._id },
      })
      .exec();

    if (!onDemandEmail) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }

    return onDemandEmail;
  }

  async update(id: string, updateOnDemandEmailDto: UpdateOnDemandEmailDto) {
    const template = await this.templatesService.templateDetails(
      updateOnDemandEmailDto.templateId,
    );

    const dto = {
      ...updateOnDemandEmailDto,
      templateName: template.name,
    };

    return this.onDemandEmailModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<OnDemandEmail> {
    const removedItem = await this.onDemandEmailModel
      .findByIdAndDelete(id)
      .exec();
    return removedItem;
  }

  async getEmailsByStatusAndDate(
    status: Statuses,
    dateTime: utcTimestampISO8601,
  ): Promise<OnDemandEmailDocument[]> {
    const date = new Date(dateTime);
    const filter = {
      status: { $eq: status },
      scheduleDate: { $lte: date },
    };
    return this.onDemandEmailModel.find(filter).populate('customer').exec();
  }

  async updateStatus(
    onDemandEmailId: SchemaId,
    status: Statuses,
  ): Promise<OnDemandEmailDocument> {
    return this.onDemandEmailModel
      .findByIdAndUpdate(onDemandEmailId, { status }, { new: true })
      .exec();
  }

  async setEmailAsDone(
    onDemandEmailId: SchemaId,
  ): Promise<OnDemandEmailDocument> {
    return this.onDemandEmailModel.findByIdAndUpdate(onDemandEmailId, {
      status: Statuses.STATUS_DONE,
      completionDate: DateTime.now(),
    });
  }

  setLeadsUsage(leads: Array<Lead>) {
    return this.leadsService.setLeadsUsage(leads, UsageFields.ON_DEMAND_EMAIL);
  }

  async updateMessageIds(
    onDemandEmailId: SchemaId,
    messageIds: Array<MessageId>,
  ): Promise<OnDemandEmailDocument> {
    return this.onDemandEmailModel.findByIdAndUpdate(
      onDemandEmailId,
      { messageIds },
      { new: true },
    );
  }

  async sendBulkEmail(
    onDemandEmailDocument: OnDemandEmailDocument,
  ): Promise<Array<SES.SendBulkTemplatedEmailResponse> | null> {
    const leads = await this.getOnDemandEmailLeads(onDemandEmailDocument);
    if (!get(leads, 'length')) {
      await this.updateStatus(onDemandEmailDocument._id, Statuses.NO_LEADS);
      return null;
    }

    const { templateId } = onDemandEmailDocument;
    const customer = <CustomerDocument>onDemandEmailDocument.customer;
    const { attributes } = customer;
    const templateData = await this.templatesService.templateDetails(
      templateId,
    );
    const isCustom = templateData.customerId === customer._id.toString();

    const templateName = isCustom
      ? buildCustomerTemplateName(templateId)
      : buildTemplateName(templateId);

    const source = attributes.email;
    const messageIds: Array<MessageId> = [];
    const responses: Array<SES.SendBulkTemplatedEmailResponse> = [];
    for await (const chunkedLeads of chunk(leads, 50)) {
      const params = this.sesService.buildParamsFromLeads(
        source,
        templateName,
        chunkedLeads,
        attributes,
      );
      const response = await this.sesService.sendBulkTemplatedEmail(params);
      responses.push(response);
      const messages = response.Status.map(({ MessageId }) => MessageId);
      messageIds.push(...messages);
    }

    await Promise.all([
      this.createEmailHistory(onDemandEmailDocument, leads),
      this.updateMessageIds(onDemandEmailDocument._id, messageIds),
      this.setLeadsUsage(leads),
      this.setEmailAsDone(onDemandEmailDocument._id),
      this.sendToES(
        onDemandEmailDocument,
        leads,
        messageIds,
        templateName,
        customer,
      ),
    ]);

    return responses;
  }

  async canBeChanged(id: string): Promise<boolean> {
    try {
      const onDemandEmail = await this.onDemandEmailModel.findById(id);
      return onDemandEmail.status === Statuses.STATUS_SCHEDULED;
    } catch (exception) {
      return false;
    }
  }

  async findByMessageId(messageId: string): Promise<OnDemandEmailDocument> {
    try {
      const filter = {
        messageIds: { $in: messageId },
      };
      return this.onDemandEmailModel.findOne(filter).exec();
    } catch (exception) {
      return null;
    }
  }

  public async getOnDemandEmailLeads(onDemandEmail: OnDemandEmailDocument) {
    const { _id: customerId, email: customerEmail } = <CustomerDocument>(
      onDemandEmail.customer
    );
    const { segments, allSegments } = onDemandEmail;
    const filters = buildFilterQueryForCampaignLeads(
      customerId,
      customerEmail,
      segments,
      allSegments,
    );

    return this.leadsService.getAllFromFilter(
      filters,
      UsageFields.ON_DEMAND_EMAIL,
    );
  }

  public async getOnDemandEmailSegments(
    onDemandEmail: OnDemandEmailDocument,
  ): Promise<Array<Segment>> {
    const filters = <SegmentQueryFilters>{
      filters: {
        ids: onDemandEmail.segments,
        bookId: null,
        name: null,
      },
    };
    return this.segmentsService.list(filters);
  }

  public async find(
    filter: FilterQuery<OnDemandEmailDocument>,
  ): Promise<Array<OnDemandEmailDocument>> {
    return this.onDemandEmailModel.find(filter).exec();
  }

  private async createEmailHistory(
    onDemandEmailDocument: OnDemandEmailDocument,
    leads: Array<LeadDocument>,
  ): Promise<void> {
    await Promise.all(
      leads.map((lead) =>
        this.emailHistoryService.addHistoryFromOnDemandEmail(<
          CreateFromEmailCampaignsDto
        >{
          lead: get<LeadDocument, '_id'>(lead, '_id'),
          relationId: onDemandEmailDocument._id,
          relationType: RelationTypes.ON_DEMAND_EMAILS,
        }),
      ),
    );
  }

  private async sendToES(
    onDemandEmailDocument: OnDemandEmailDocument,
    leads: Array<LeadDocument>,
    messageIds: Array<MessageId>,
    templateName: string,
    customer: CustomerDocument,
  ): Promise<void> {
    const segments = await this.getOnDemandEmailSegments(onDemandEmailDocument);
    const payload = <LoggerPayload>{
      id: onDemandEmailDocument._id,
      segmentsNames: map(segments, (segment) => segment.name),
      messageIds,
      templateName,
      allSegments: onDemandEmailDocument.allSegments,
      customerId: get(customer, '_id'),
      customerFirstName: get(customer, 'firstName'),
      customerLastName: get(customer, 'lastName'),
      customerEmail: get(customer, 'email'),
      leadEmails: map(leads, (lead: Lead) => lead.email),
      usageDate: DateTime.now(),
    };
    this.logger.log({ payload }, CONTEXT_ON_DEMAND_EMAIL);
  }

  async generateOnDemandEmails(
    onDemandEmails: OnDemandEmailDocument[],
  ): Promise<EmailMessage[]> {
    const emailMessages = <EmailMessage[]>[];
    const errors = [];
    await Promise.all(
      onDemandEmails.map(async (onDemandEmail) => {
        try {
          const { templateId, customer, subject } = onDemandEmail;
          const { email: sender, attributes } = <CustomerDocument>customer;

          const leads = await this.getOnDemandEmailLeadsCron(onDemandEmail);

          if (!leads?.length) {
            await this.updateStatusCron(onDemandEmail._id, Statuses.NO_LEADS);
          }

          const templateData = await this.templatesService.templateDetails(
            templateId,
          );

          leads.map((lead) => {
            const { email } = lead;
            emailMessages.push({
              provider: 'aws',
              from: attributes?.email || sender,
              to: email,
              subject,
              html: this.getHtmlFromLead(
                lead,
                templateData.content,
                <{ [key: string]: any }>attributes,
              ),
            });
          });
        } catch (err) {
          errors.push(err);
        }
      }),
    );
    return emailMessages;
  }

  async handleCron() {
    const onDemandEmails = await this.getEmailsByStatusAndDate(
      Statuses.STATUS_SCHEDULED,
      DateTime.now().toISO(),
    );

    if (get(onDemandEmails, 'length')) {
      for await (const onDemandEmailDocument of onDemandEmails) {
        const { _id: id } = onDemandEmailDocument;
        const data = await this.generateOnDemandEmails(onDemandEmails);
        try {
          await this.updateStatus(id, Statuses.STATUS_IN_PROGRESS);
          const messagesId = await this.afyNotificationsService.sendEmail(data);
          await this.updateMessageIds(id, messagesId);
        } catch (err) {
          if (err instanceof Error) {
            const { name, stack, message } = err;
            this.logger.error(
              {
                payload: <LoggerPayload>{
                  usageDate: DateTime.now(),
                  name,
                  stack,
                  message,
                  onDemandEmail: id,
                },
              },
              '',
              CONTEXT_ON_DEMAND_EMAIL_ERROR,
            );
          }
        }
      }
    }
  }

  async checkStatus(): Promise<void> {
    const filter: FilterQuery<OnDemandEmailDocument> = {
      status: Statuses.STATUS_IN_PROGRESS,
    };

    const onDemandEmails = await this.find(filter);

    await Promise.all(
      onDemandEmails.map(async (onDemandEmail) => {
        try {
          const messageIds = onDemandEmail.messageIds.filter((id) => id);

          if (messageIds.length === 0) {
            return;
          }

          const status = await this.afyNotificationsService.checkStatusOf(
            messageIds,
          );

          if (status) {
            await this.updateStatus(onDemandEmail._id, Statuses.STATUS_DONE);
          }
        } catch (error) {
          if (error instanceof CheckStatusOfEmailMessageException) {
            const { name, stack, message } = error;
            this.logger.error(
              {
                payload: <LoggerPayload>{
                  usageDate: DateTime.now(),
                  name,
                  stack,
                  message,
                  onDemandEmail: onDemandEmail._id,
                  exception: 'CheckStatusOfEmailMessageException',
                },
              },
              stack,
              CONTEXT_ON_DEMAND_EMAIL_ERROR,
            );
          }
        }
      }),
    );
  }

  private getHtmlFromLead(
    lead: LeadDocument,
    template: string,
    attributes: { [key: string]: string },
  ): string {
    const { email, firstName, lastName } = lead;

    const templateData = {
      LEAD_FIRST_NAME: firstName,
      LEAD_LAST_NAME: lastName,
      LEAD_EMAIL: email,
      LEAD_UNSUBSCRIBE_URL: this.sesService.generateRouteForUnsubscribe(
        lead._id.toString(),
      ),
      BROKER_ADDRESS: attributes?.brokerAddress || '',
      PROFILE_IMAGE: attributes?.imageUrl || '',
      MEMBER_FIRST_NAME: attributes?.memberFirstName || '',
      MEMBER_LAST_NAME: attributes?.memberLastName || '',
      MEMBER_TITLE: attributes?.memberTitle || '',
      MEMBER_BROKER_NAME: attributes?.memberBrokerName || '',
      MEMBER_ADDRESS: attributes?.memberAddress || '',
      MEMBER_PHONE: attributes?.memberPhone || '',
      MEMBER_PROFILE_IMAGE: attributes?.memberProfileImage || '',
      MEMBER_EMAIL: attributes?.memberEmail || '',
      MEMBER_BOOK_URL: attributes?.memberBookUrl || '',
    };

    return replaceTagsOnDemandEmails(template, templateData);
  }

  private async getOnDemandEmailLeadsCron(
    onDemandEmail: OnDemandEmailDocument,
  ): Promise<LeadDocument[]> {
    const { _id: customerId, email: customerEmail } = <CustomerDocument>(
      onDemandEmail.customer
    );
    const { segments, allSegments } = onDemandEmail;
    const filters = buildFilterQueryForCampaignLeads(
      customerId,
      customerEmail,
      segments,
      allSegments,
    );

    return this.leadsService.getAllFromFilter(
      filters,
      UsageFields.ON_DEMAND_EMAIL,
    );
  }

  private async updateStatusCron(
    onDemandEmailId: SchemaId,
    status: Statuses,
  ): Promise<OnDemandEmailDocument> {
    return this.onDemandEmailModel
      .findByIdAndUpdate(onDemandEmailId, { status }, { new: true })
      .exec();
  }
}

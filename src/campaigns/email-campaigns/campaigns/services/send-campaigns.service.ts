import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CampaignsService } from '@/campaigns/email-campaigns/campaigns/services/campaigns.service';
import { LeadDocument } from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
import { filter, get, isEmpty } from 'lodash';
import { CustomersService } from '@/customers/customers/customers.service';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { UsageFields } from '@/campaigns/email-campaigns/leads/domain/types';
import { LeadsService } from '@/campaigns/email-campaigns/leads/leads.service';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { CampaignDocument } from '@/campaigns/email-campaigns/campaigns/schemas/campaign.schema';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { DateTime } from 'luxon';
import { Email } from '@/cms/cms/types/email';
import { CampaignEvents } from '@/campaigns/email-campaigns/campaigns/listeners/campaign.listeners';
import {
  CampaignNoEmailsEvent,
  CampaignNoLeadsEvent,
} from '@/campaigns/email-campaigns/campaigns/events';
import { MessageId } from 'aws-sdk/clients/ses';
import { sleep } from '@/internal/utils/functions';
import {
  CampaignHandler,
  CampaignHistoryType,
  CampaignStatus,
} from '@/campaigns/email-campaigns/campaigns/domain/types';
import { InjectModel } from '@nestjs/mongoose';
import {
  CampaignHistory,
  CampaignHistoryDocument,
} from '@/campaigns/email-campaigns/campaigns/schemas/campaign-history.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContentsService } from '@/campaigns/email-campaigns/contents/contents.service';
import { EmailHistoryDocument } from '@/campaigns/email-campaigns/email-history/schemas/email-history.schema';
import { CreateFromEmailCampaignsDto } from '@/campaigns/email-campaigns/email-history/dto/create-from-email-campaigns.dto';
import { RelationTypes } from '@/campaigns/email-campaigns/email-history/schemas/types';
import { EmailHistoryService } from '@/campaigns/email-campaigns/email-history/email-history.service';
import { CampaignRepository } from '@/campaigns/email-campaigns/campaigns/repositories/campaign.repository';
import { diffInDaysFromToday } from '@/internal/utils/date';
import { DataObject } from '@/cms/cms/types/common';
import { Template } from '@/cms/cms/types/template';
import {
  CONTEXT_EMAIL_CAMPAIGNS_DEBUG,
  CONTEXT_EMAIL_CAMPAIGNS_ERROR,
} from '@/internal/common/contexts';
import { LoggerPayload } from '@/internal/utils/logger';
import { buildFilterQueryForCampaignLeads } from '@/campaigns/email-campaigns/leads/utils/filters';
import {
  AfyNotificationsService,
  EmailMessage,
} from '@/integrations/afy-notifications/afy-notifications.service';
import { replaceTagsOnDemandEmails } from '@/internal/utils/aws/ses/replaceTags';
import { CampaignWithoutAvailableLeadsException } from '@/campaigns/email-campaigns/campaigns/Exceptions/campaign-without-available-leads.exception';
import { CampaignWithoutAvailableEmailsException } from '@/campaigns/email-campaigns/campaigns/Exceptions/campaign-without-available-emails.exception';
import { Status } from '@/customers/customers/domain/types';

@Injectable()
export class SendCampaignsService {
  constructor(
    @Inject(forwardRef(() => CampaignsService))
    private readonly campaignsService: CampaignsService,
    private readonly customersService: CustomersService,
    private readonly sesService: SesService,
    private readonly leadsService: LeadsService,
    private readonly contentsService: ContentsService,
    private readonly emailHistoryService: EmailHistoryService,
    private readonly campaignsRepository: CampaignRepository,

    @InjectModel(CampaignHistory.name)
    private readonly campaignHistoryModel: Model<CampaignHistoryDocument>,
    private readonly eventEmitter: EventEmitter2,
    private readonly afyNotificationsService: AfyNotificationsService,
    private readonly logger: Logger,
  ) {}

  async sendCampaign(
    customerEmail: string,
    templateName: string,
    leads: LeadDocument[],
  ) {
    const customer = await this.customersService.findByEmail(customerEmail);
    const sourceEmail = get(customer, ['attributes', 'email']);
    const attributes = get(customer, ['attributes']);

    const params = this.sesService.buildParamsFromLeads(
      sourceEmail,
      templateName,
      leads,
      attributes,
    );

    return this.sesService.sendBulkTemplatedEmail(params);
  }

  async setLeadsUsage(leads: Array<LeadDocument>) {
    return this.leadsService.setLeadsUsage(leads, UsageFields.EMAIL_CAMPAIGN);
  }

  // DO NOT REMOVE THIS METHOD
  async sendAbsoluteCampaign(campaign: CampaignDocument) {
    const customer = <CustomerDocument>campaign.customer;
    const content = await this.contentsService.detailsRaw(campaign.contentId);

    const now = DateTime.now();
    const month = now.month;
    const day = now.day;

    const emails = filter<Email>(
      content.attributes.emails,
      ({ usesRelativeTime, absoluteDay, absoluteMonth }) => {
        return (
          !usesRelativeTime && absoluteDay === day && absoluteMonth === month
        );
      },
    );

    this.logger.log(
      {
        payload: <LoggerPayload>{
          usageDate: DateTime.now(),
          message: `List of emails for ${campaign._id}`,
          emails,
        },
      },
      CONTEXT_EMAIL_CAMPAIGNS_DEBUG,
    );

    const leads = await this.getCampaignLeads(campaign);

    this.logger.log(
      {
        payload: <LoggerPayload>{
          usageDate: DateTime.now(),
          message: `List of leads for ${campaign._id}`,
          leads: leads?.map((lead) => {
            return {
              id: lead._id,
              email: lead.email,
              name: lead.firstName,
            };
          }),
        },
      },
      CONTEXT_EMAIL_CAMPAIGNS_DEBUG,
    );

    this.handleEvents(campaign, emails, leads);

    const messageIds: Array<MessageId> = [];
    const templateNames: Array<string> = [];
    const leadsToUpdate: Array<LeadDocument> = [];
    for (const email of emails) {
      const { template } = this.getCustomTemplateIfExists(email, customer);

      const processedData = await this.processCampaignForChunkedLeads(
        leads,
        customer,
        template,
      );

      messageIds.push(...processedData.emailMessageIds);

      this.logger.log(
        {
          payload: <LoggerPayload>{
            usageDate: DateTime.now(),
            message: `AWS Response ${campaign._id}`,
            processedData,
          },
        },
        CONTEXT_EMAIL_CAMPAIGNS_DEBUG,
      );
      leadsToUpdate.push(...processedData.leadsToUpdate);
    }

    if (!isEmpty(messageIds)) {
      await this.campaignsService.update(campaign._id, {
        $push: {
          messageIds,
        },
      });
    }
    if (!isEmpty(leadsToUpdate)) {
      await this.setLeadsUsage(leadsToUpdate);
      for (const lead of leadsToUpdate) {
        await this.createHistory(campaign, lead);
      }
    }
  }

  // DO NOT REMOVE THIS METHOD
  async sendRelativeCampaign(campaign: CampaignDocument) {
    const customer = <CustomerDocument>campaign.customer;
    const content = await this.contentsService.detailsRaw(campaign.contentId);

    const emails = filter<Email>(
      content.attributes.emails,
      ({ usesRelativeTime }) => usesRelativeTime,
    );

    this.logger.log(
      {
        payload: <LoggerPayload>{
          usageDate: DateTime.now(),
          message: `List of emails for ${campaign._id}`,
          emails,
        },
      },
      CONTEXT_EMAIL_CAMPAIGNS_DEBUG,
    );

    const leads = await this.getCampaignLeads(campaign);

    this.logger.log(
      {
        payload: <LoggerPayload>{
          usageDate: DateTime.now(),
          message: `List of leads for ${campaign._id}`,
          leads: leads?.map((lead) => {
            return {
              id: lead._id,
              email: lead.email,
              name: lead.firstName,
            };
          }),
        },
      },
      CONTEXT_EMAIL_CAMPAIGNS_DEBUG,
    );

    this.handleEvents(campaign, emails, leads);

    const messageIds: Array<MessageId> = [];
    const templateNames: Array<string> = [];
    const leadsToUpdate: Array<LeadDocument> = [];

    for (const email of emails) {
      const { template } = this.getCustomTemplateIfExists(email, customer);

      const { relativeDays } = email;
      const relativeLeads = leads.filter((lead) => {
        return relativeDays === diffInDaysFromToday(lead.createdAt);
      });

      if (isEmpty(relativeLeads)) {
        this.eventEmitter.emit(
          CampaignEvents.NO_LEADS,
          new CampaignNoLeadsEvent(campaign),
        );
      }

      const processedData = await this.processCampaignForChunkedLeads(
        relativeLeads,
        customer,
        template,
      );

      messageIds.push(...processedData.emailMessageIds);

      this.logger.log(
        {
          payload: <LoggerPayload>{
            usageDate: DateTime.now(),
            message: `AWS Response ${campaign._id}`,
            processedData,
          },
        },
        CONTEXT_EMAIL_CAMPAIGNS_DEBUG,
      );
      leadsToUpdate.push(...processedData.leadsToUpdate);
    }

    if (!isEmpty(messageIds)) {
      await this.campaignsService.update(campaign._id, {
        $push: {
          messageIds,
        },
      });
    }

    if (!isEmpty(leadsToUpdate)) {
      await this.setLeadsUsage(leadsToUpdate);
      for (const lead of leadsToUpdate) {
        await this.createHistory(campaign, lead);
      }
    }
  }

  async sendAllCampaignsByHandler(
    campaigns: Array<CampaignDocument>,
    handler: CampaignHandler,
  ): Promise<void> {
    this.logger.log(
      {
        payload: <LoggerPayload>{
          usageDate: DateTime.now(),
          message: `Sending ${handler} campaigns start`,
        },
      },
      CONTEXT_EMAIL_CAMPAIGNS_DEBUG,
    );

    if (isEmpty(campaigns)) {
      this.logger.log(
        {
          payload: <LoggerPayload>{
            usageDate: DateTime.now(),
            message: 'No campaigns to send',
          },
        },
        CONTEXT_EMAIL_CAMPAIGNS_DEBUG,
      );
      return;
    }

    for (const campaign of campaigns) {
      try {
        this.logger.log(
          {
            payload: <LoggerPayload>{
              usageDate: DateTime.now(),
              campaignId: campaign._id,
              message: `Campaign ${campaign._id} sent start`,
            },
          },
          CONTEXT_EMAIL_CAMPAIGNS_DEBUG,
        );

        await this[handler](campaign);

        this.logger.log(
          {
            payload: <LoggerPayload>{
              usageDate: DateTime.now(),
              campaignId: campaign._id,
              message: `Campaign ${campaign._id} sent end`,
            },
          },
          CONTEXT_EMAIL_CAMPAIGNS_DEBUG,
        );
      } catch (exception) {
        const exceptionIsInstanceOf =
          exception instanceof CampaignWithoutAvailableLeadsException ||
          exception instanceof CampaignWithoutAvailableEmailsException;

        const shouldLog = !exceptionIsInstanceOf && exception instanceof Error;

        if (shouldLog) {
          const customer = <CustomerDocument>campaign.customer;
          const payload = <LoggerPayload>{
            campaignId: campaign._id.toString(),
            customerId: customer._id.toString(),
            customerName: `${customer.firstName} ${customer.lastName}`,
            customerEmail: customer.email,
            exception,
            usageDate: DateTime.now(),
          };
          this.logger.error(
            { payload },
            exception?.stack,
            CONTEXT_EMAIL_CAMPAIGNS_ERROR,
          );
        }
      } finally {
        this.logger.log(
          {
            payload: <LoggerPayload>{
              usageDate: DateTime.now(),
              message: `Sending ${handler} campaigns end`,
            },
          },
          CONTEXT_EMAIL_CAMPAIGNS_DEBUG,
        );
        await sleep(1000);
      }
    }
  }

  public async processCampaignForChunkedLeads(
    leads: Array<LeadDocument>,
    customer: CustomerDocument,
    template: DataObject<Template>,
  ) {
    const leadsToUpdate = <Array<LeadDocument>>[];
    const emailMessages = leads.map((lead) => {
      leadsToUpdate.push(lead);
      return <EmailMessage>{
        from: customer.attributes.email,
        to: lead.email,
        subject: this.getHtmlFromLead(
          lead,
          template.attributes.subject,
          // @ts-ignore
          customer.attributes,
        ),
        html: this.getHtmlFromLead(
          lead,
          template.attributes.content,
          // @ts-ignore
          customer.attributes,
        ),
        provider: 'aws',
      };
    });

    const emailMessageIds = [];

    for (const emailMessage of emailMessages) {
      // TODO: remove sleep after testing
      const id = await this.afyNotificationsService.sendEmail([emailMessage]);
      emailMessageIds.push(...id);
      await sleep(50);
    }

    return { leadsToUpdate, emailMessageIds };
  }

  async createCampaignHistory(
    campaign: CampaignDocument,
    templateNames: Array<string>,
    messageIds: Array<MessageId>,
    type: CampaignHistoryType,
  ) {
    const history = new this.campaignHistoryModel({
      campaign: campaign._id,
      templateNames,
      messageIds,
      type,
    });
    return history.save();
  }

  async getCampaignLeads(campaign: CampaignDocument): Promise<LeadDocument[]> {
    const { allSegments, customer, segments } = campaign;
    const { _id: customerId, email: customerEmail } = <CustomerDocument>(
      customer
    );

    const filters = buildFilterQueryForCampaignLeads(
      customerId,
      customerEmail,
      segments,
      allSegments,
    );

    return this.leadsService.getAllFromFilter(
      filters,
      // UsageFields.EMAIL_CAMPAIGN,
    );
  }

  async createHistory(
    campaign: CampaignDocument,
    lead: LeadDocument,
  ): Promise<EmailHistoryDocument> {
    const dto = <CreateFromEmailCampaignsDto>{
      lead: get(lead, '_id'),
      relationId: get(campaign, '_id'),
      relationType: RelationTypes.CAMPAIGNS,
    };
    return this.emailHistoryService.addHistoryFromOnDemandEmail(dto);
  }

  async getCampaignsToBeSent(): Promise<CampaignDocument[] | null> {
    const filter: FilterQuery<CampaignDocument> = {
      status: CampaignStatus.ACTIVE,
      startDate: { $lte: DateTime.now() },
    };
    const options: QueryOptions = {
      populate: ['customer'],
    };

    const campaigns = await this.campaignsRepository.findAll(filter, options);

    return campaigns.filter(
      (c) => (<CustomerDocument>c?.customer)?.status === Status.ACTIVE,
    );
  }

  public handleEvents(
    campaign: CampaignDocument,
    emails: Array<Email>,
    leads: Array<LeadDocument>,
  ): void {
    if (isEmpty(emails)) {
      this.eventEmitter.emit(
        CampaignEvents.NO_EMAILS,
        new CampaignNoEmailsEvent(campaign),
      );
    }

    if (isEmpty(leads)) {
      this.eventEmitter.emit(
        CampaignEvents.NO_LEADS,
        new CampaignNoLeadsEvent(campaign),
      );
    }
  }

  public getCustomTemplateIfExists(
    email: Email,
    customer: CustomerDocument,
  ): { template: DataObject<Template>; isCustom: boolean } {
    let isCustom = false;
    let template = email.template.data.attributes.emailTemplates?.data.find(
      (template) => template.attributes.customerId === customer._id.toString(),
    );

    if (template) {
      isCustom = true;
    } else {
      template = email.template.data;
    }

    return { template, isCustom };
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
}

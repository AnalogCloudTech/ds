import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FilterQuery, QueryOptions } from 'mongoose';
import {
  EmailHistory,
  EmailHistoryDocument,
} from '@/campaigns/email-campaigns/email-history/schemas/email-history.schema';
import { CreateFromEmailCampaignsDto } from '@/campaigns/email-campaigns/email-history/dto/create-from-email-campaigns.dto';
import { CampaignsService } from '../campaigns/services';
import { LeadsService } from '../leads/leads.service';
import { OnDemandEmailsService } from '../on-demand-emails/on-demand-emails.service';
import { LeadHistoryStatus, RelationTypes } from './schemas/types';
import { SNSMessage } from './utils/parse-sns-response';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { forEach, get } from 'lodash';
import { CampaignsHistoryIds, CampaignsIds } from './domain/types';
import { EmailHistoryRepository } from '@/campaigns/email-campaigns/email-history/email-history.repository';
import extractEmailsFromSNSMessage, {
  extractDiagnosticCode,
} from '@/campaigns/email-campaigns/email-history/utils/extract-data';

@Injectable()
export class EmailHistoryService {
  constructor(
    private readonly emailHistoryRepository: EmailHistoryRepository,
    @Inject(forwardRef(() => CampaignsService))
    private readonly campaignsService: CampaignsService,
    @Inject(forwardRef(() => OnDemandEmailsService))
    private readonly onDemandEmailsService: OnDemandEmailsService,
    private readonly leadsService: LeadsService,
  ) {}

  public async listEmailHistory(
    user: any,
    page: number,
    perPage: number,
    status: LeadHistoryStatus[],
    type: RelationTypes[],
  ): Promise<PaginatorSchematicsInterface<EmailHistoryDocument>> {
    const leads = await this.leadsService.findAll(user);
    const query: FilterQuery<EmailHistoryDocument> = {
      lead: { $in: leads.map(({ _id }) => _id) || [] },
    };

    if (status) {
      query['status'] = { $in: status };
    }

    if (type) {
      query['relationType'] = { $in: type };
    }

    const options: QueryOptions = {
      sort: { createdAt: 'desc' },
      skip: page * perPage,
      limit: perPage,
      populate: ['relationId', 'lead'],
    };

    return this.emailHistoryRepository.findAllPaginated(query, options);
  }

  public async getEmailHistory(
    user: any,
    id: string,
  ): Promise<Array<EmailHistoryDocument>> {
    const leads = await this.leadsService.findAll(user);
    const query: FilterQuery<EmailHistoryDocument> = {
      _id: { $eq: id },
      lead: { $in: leads.map(({ _id }) => _id) || [] },
    };
    const options: QueryOptions = {
      populate: ['relationId', 'lead'],
    };
    const emailHistory = await this.emailHistoryRepository.findAll(
      query,
      options,
    );

    if (!emailHistory)
      throw new HttpException('Email History not found', HttpStatus.NOT_FOUND);

    return emailHistory;
  }

  public async getEmailHistoryByLead(
    user: any,
    leadId: string,
    page: number,
    perPage: number,
    status: LeadHistoryStatus[],
    type: RelationTypes[],
  ): Promise<PaginatorSchematicsInterface<EmailHistoryDocument>> {
    const leads = await this.leadsService.findAll(user);

    const query: FilterQuery<EmailHistoryDocument> = {
      lead: {
        $in: leads.filter(({ _id }) => _id.toString() === leadId) || [],
      },
    };

    if (status) {
      query['status'] = { $in: status };
    }

    if (type) {
      query['relationType'] = { $in: type };
    }

    const options: QueryOptions = {
      sort: { createdAt: 'desc' },
      skip: page * perPage,
      limit: perPage,
      populate: ['relationId', 'lead'],
    };

    return this.emailHistoryRepository.findAllPaginated(query, options);
  }

  public async createFromSNS(
    snsMessage: SNSMessage,
  ): Promise<Array<EmailHistoryDocument>> {
    const emails = extractEmailsFromSNSMessage(snsMessage);
    const { messageId, timestamp } = snsMessage.mail;

    const eventType = snsMessage.eventType.toUpperCase();
    const isBounce = eventType.toLocaleLowerCase() === LeadHistoryStatus.BOUNCE;
    const isHardBounce =
      isBounce && snsMessage?.bounce?.bounceType === 'Permanent';
    const isSoftBounce = isBounce && !isHardBounce;
    const diagnosticCodes = extractDiagnosticCode(snsMessage);

    return await Promise.all(
      emails.map(async (email) => {
        const findCampaignHistory =
          await this.campaignsService.findCampaignHistoryByMessageId(messageId);

        const findOnDemandEmail =
          await this.onDemandEmailsService.findByMessageId(messageId);

        if (findCampaignHistory || findOnDemandEmail) {
          const isValid =
            !isHardBounce ||
            ![
              LeadHistoryStatus.COMPLAINT,
              LeadHistoryStatus.UNSUBSCRIBED,
              LeadHistoryStatus.REJECTED,
            ].includes(<LeadHistoryStatus>eventType.toLocaleLowerCase());

          const updatedLeads = await this.leadsService.updateMany(
            {
              email: { $eq: email },
            },
            {
              isValid,
            },
          );
          const [lead] = updatedLeads;
          const status = isSoftBounce
            ? LeadHistoryStatus.SOFT_BOUNCE
            : <string>LeadHistoryStatus[`${eventType}`] ||
              <string>LeadHistoryStatus.DEFAULT;

          const emailHistoryData = {
            lead,
            sentDate: timestamp,
            relationId: findCampaignHistory || findOnDemandEmail,
            relationType: findCampaignHistory
              ? RelationTypes.CAMPAIGNS_HISTORY
              : RelationTypes.ON_DEMAND_EMAILS,
            status,
            extraInfos: diagnosticCodes,
            rawData: snsMessage,
          };

          return this.emailHistoryRepository.store(emailHistoryData);
        }
      }),
    );
  }

  async addHistoryFromOnDemandEmail(dto: CreateFromEmailCampaignsDto) {
    return this.emailHistoryRepository.store(dto);
  }

  async getEmailHistoryCount(
    campaignsIds: CampaignsIds[],
  ): Promise<[number, number]> {
    const emailCount = [];
    const emailBounceCount = [];
    const campaignsHistory = await this.emailHistoryRepository.findAll({
      relationId: { $in: campaignsIds },
      relationType: RelationTypes.CAMPAIGNS,
    });
    forEach(campaignsHistory, (emailHistory) => {
      if (emailHistory.status === LeadHistoryStatus.SEND) {
        emailCount.push(emailHistory);
      }
      if (emailHistory.status === LeadHistoryStatus.BOUNCE) {
        emailBounceCount.push(emailHistory);
      }
    });
    return [emailCount.length, emailBounceCount.length];
  }

  async getEmailHistoryCountBycampaignHisId(
    campaignsHistoryids: CampaignsHistoryIds[],
  ): Promise<[number, number]> {
    const [emailCount, emailBounceCount] = await Promise.all([
      this.emailHistoryRepository.findAll({
        relationId: { $in: campaignsHistoryids },
        relationType: RelationTypes.CAMPAIGNS_HISTORY,
        $or: [
          { status: LeadHistoryStatus.DELIVERY },
          { status: LeadHistoryStatus.BOUNCE },
        ],
      }),
      this.emailHistoryRepository.findAll({
        relationId: { $in: campaignsHistoryids },
        status: LeadHistoryStatus.BOUNCE,
        relationType: RelationTypes.CAMPAIGNS_HISTORY,
      }),
    ]);
    return [emailCount.length, emailBounceCount.length];
  }

  async getEmailHistoryCountBycampaignHistoryId(
    campaignsIds: CampaignsHistoryIds,
    email: string,
  ): Promise<[number, number, number]> {
    const emailCount = [];
    const emailBounceCount = [];
    const unSubscribedLeadCount = [];
    const leads = await this.leadsService.findAllLeadsByMemberEmailId(email);
    const query: FilterQuery<EmailHistoryDocument> = {
      relationId: { $eq: campaignsIds },
      lead: { $in: leads.map(({ _id }) => _id) || [] },
    };
    const options: QueryOptions = {
      populate: ['relationId', 'lead'],
    };
    const campaignsHistory = await this.emailHistoryRepository.findAll(
      query,
      options,
    );

    forEach(campaignsHistory, (emailHistory: EmailHistoryDocument) => {
      const unsubsc = <boolean>get(emailHistory, ['lead', 'unsubscribed']);

      if (unsubsc) {
        unSubscribedLeadCount.push(emailHistory);
      }
      if (emailHistory.status === LeadHistoryStatus.DELIVERY) {
        emailCount.push(emailHistory);
      }
      if (emailHistory.status === LeadHistoryStatus.BOUNCE) {
        emailBounceCount.push(emailHistory);
      }
    });
    return [
      emailCount.length,
      emailBounceCount.length,
      unSubscribedLeadCount.length,
    ];
  }

  async countEmailHistory(filter: FilterQuery<EmailHistory>) {
    return this.emailHistoryRepository.count(filter);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateSmsCampaignDto } from './dto/create-sms-campaign.dto';
import { UpdateSmsCampaignDto } from './dto/update-sms-campaign.dto';
import { SmsCampaignRepository } from '@/campaigns/sms/sms-campaigns/repositories/sms-campaign.repository';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { FilterQuery, QueryOptions } from 'mongoose';
import { SmsCampaignDocument } from '@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema';
import { Paginator } from '@/internal/utils/paginator';
import { SchemaId } from '@/internal/types/helpers';
import { LeadsService } from '@/campaigns/email-campaigns/leads/leads.service';
import { LeadDocument } from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
import { Statuses } from '@/campaigns/sms/sms-campaigns/domain/types';
import { DateTime } from 'luxon';

@Injectable()
export class SmsCampaignsService {
  constructor(
    private readonly repository: SmsCampaignRepository,
    private readonly leadsService: LeadsService,
  ) {}

  store(
    customer: CustomerDocument,
    createSmsCampaignDto: CreateSmsCampaignDto,
  ) {
    const data = {
      customer: customer._id,
      ...createSmsCampaignDto,
    };

    return this.repository.store(data);
  }

  findAllPaginated(
    customer: CustomerDocument,
    paginator: Paginator,
    query: FilterQuery<SmsCampaignDocument> = {},
  ) {
    query['customer'] = {
      $eq: customer._id,
    };
    const options: QueryOptions = {
      skip: paginator.page * paginator.perPage,
      sort: { createdAt: 'desc' },
    };

    return this.repository.findAllPaginated(query, options);
  }

  async findOne(id: SchemaId): Promise<SmsCampaignDocument> {
    return this.repository.findById(id);
  }

  async update(
    id: SchemaId,
    updateSmsCampaignDto: UpdateSmsCampaignDto,
  ): Promise<SmsCampaignDocument> {
    return this.repository.update(id, updateSmsCampaignDto);
  }

  async remove(id: SchemaId): Promise<SmsCampaignDocument> {
    return this.repository.delete(id);
  }

  async campaignsToBeSent(): Promise<Array<SmsCampaignDocument>> {
    const query: FilterQuery<SmsCampaignDocument> = {
      status: { $eq: Statuses.STATUS_SCHEDULED },
      scheduleDate: { $lte: DateTime.now() },
    };

    const options: QueryOptions = {
      populate: ['customer'],
      sort: { createdAt: 'asc' },
    };

    return this.repository.findAll(query, options);
  }

  async getLeads(
    smsCampaign: SmsCampaignDocument,
    customer: CustomerDocument,
  ): Promise<Array<LeadDocument>> {
    const filters: FilterQuery<LeadDocument> = {
      $and: [
        { unsubscribed: { $eq: false } },
        {
          $or: [
            { customerEmail: { $eq: customer.email } },
            { customer: { $eq: customer._id } },
          ],
        },
      ],
    };

    if (!smsCampaign.allSegments) {
      filters.$and.push({
        $or: [
          { segments: { $in: smsCampaign.segments } },
          { allSegments: true },
        ],
      });
    }

    return this.leadsService.getAllFromFilter(filters);
  }

  async setDone(
    smsCampaign: SmsCampaignDocument,
  ): Promise<SmsCampaignDocument> {
    return this.repository.update(smsCampaign._id, {
      status: Statuses.STATUS_DONE,
    });
  }
}

import { Injectable, PipeTransform } from '@nestjs/common';
import { LeadHistoryStatus, RelationTypes } from '../../schemas/types';

export interface Filters {
  status?: LeadHistoryStatus[];
  types?: RelationTypes[];
  [key: string]: any;
}

@Injectable()
export default class EmailHistoryFilters implements PipeTransform {
  public transform({ types, status }: { types: string; status: string }) {
    const typesMap = {
      OnDemandEmails: RelationTypes.ON_DEMAND_EMAILS,
      Campaigns: RelationTypes.CAMPAIGNS,
    };

    const statusMap = {
      Bounced: LeadHistoryStatus.BOUNCE,
      Opened: LeadHistoryStatus.OPEN,
      Rejected: LeadHistoryStatus.REJECTED,
      Spam: LeadHistoryStatus.COMPLAINT,
      Success: LeadHistoryStatus.DELIVERY,
      Unsubscribed: LeadHistoryStatus.UNSUBSCRIBED,
      Sent: LeadHistoryStatus.SEND,
    };

    const typesParsed = types?.split(',').reduce((acc, type) => {
      if (typesMap[type]) {
        acc.push(typesMap[type]);
      }
      return acc;
    }, [] as RelationTypes[]);

    const statusParsed = status?.split(',').reduce((acc, status) => {
      if (statusMap[status]) {
        acc.push(statusMap[status]);
      }
      return acc;
    }, [] as LeadHistoryStatus[]);

    return {
      types: typesParsed || null,
      status: statusParsed || null,
    };
  }
}

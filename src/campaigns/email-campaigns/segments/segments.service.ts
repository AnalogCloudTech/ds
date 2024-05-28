import { CmsService } from '@/cms/cms/cms.service';
import {
  SegmentQueryFilters,
  SegmentQueryFiltersById,
} from '@/campaigns/email-campaigns/segments/types';
import { filter, flatMap, get, map, uniq } from 'lodash';
import {
  CmsFilterBuilder,
  CmsFilterObject,
  ResponseSegmentsType,
} from '@/internal/utils/cms/filters/cms.filter.builder';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { LeadsService } from '@/campaigns/email-campaigns/leads/leads.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Document, FilterQuery } from 'mongoose';
import { Event, EventType, Models } from '@/cms/cms/types/webhook';
import { Segment } from '@/campaigns/email-campaigns/segments/domain/segment';
import { Segments } from '@/campaigns/email-campaigns/campaigns/domain/types';

@Injectable()
export class SegmentsService {
  constructor(
    private readonly cmsService: CmsService,
    @Inject(forwardRef(() => LeadsService))
    private readonly leadsService: LeadsService,
  ) {}

  async list(queryFilter: SegmentQueryFilters): Promise<Array<Segment>> {
    const { filters } = queryFilter;
    const name = get(filters, ['name']);
    const bookId = get(filters, ['bookId']);
    const ids = get(filters, ['ids']);
    const filterObjects: CmsFilterObject[] = [];

    if (name) {
      filterObjects.push(<CmsFilterObject>{
        name: 'name',
        operator: '$contains',
        value: name,
      });
    }

    if (bookId) {
      filterObjects.push(<CmsFilterObject>{
        name: 'bookId',
        operator: '$eq',
        value: bookId,
      });
    }

    if (get(ids, 'length')) {
      filterObjects.push(<CmsFilterObject>{
        name: 'id',
        operator: '$in',
        value: ids,
      });
    }

    const queryString = '?' + CmsFilterBuilder.build(filterObjects);
    return this.cmsService.segmentsList(queryString);
  }

  async listById(
    queryFilter: SegmentQueryFiltersById,
  ): Promise<Array<ResponseSegmentsType>> {
    const { filters } = queryFilter;
    const ids = get(filters, ['ids']);
    const filterObjects: CmsFilterObject[] = [];

    if (get(ids, 'length')) {
      filterObjects.push(<CmsFilterObject>{
        name: 'id',
        operator: '$in',
        value: ids,
      });
    }

    const queryString = '?' + CmsFilterBuilder.build(filterObjects);

    return this.cmsService.segmentsList(queryString);
  }

  async attachSegments<ItemT = any, ReturnT = any>(
    listT: Array<ItemT & Document & { segments: Segments }>,
    segmentsId: Array<number>,
  ): Promise<Array<ReturnT>> {
    const uniqueSegmentsId = uniq(segmentsId);
    const filterSegments = <SegmentQueryFilters>{
      filters: {
        ids: uniqueSegmentsId,
      },
    };

    const segmentsList = await this.list(filterSegments);

    return map(listT, (itemT) => {
      const segments = flatMap(itemT?.segments, function (segmentId) {
        return segmentsList.filter(
          (segmentObject) => segmentObject.id === segmentId,
        );
      });

      const idProperty = itemT?._id ? '_id' : 'id';
      const object = itemT instanceof Document ? itemT.toObject() : itemT;

      return <ReturnT>{
        id: <string>itemT[idProperty].toString(),
        ...object,
        segments,
      };
    });
  }

  async listWithCustomerLeadsCount(
    customer: CustomerDocument,
    filters: SegmentQueryFilters,
  ) {
    const list = await this.list(filters);

    const segmentsId: Array<number> = map(list, (item) => item.id);
    const filterObject: FilterQuery<any> = {
      isValid: { $eq: true },
      unsubscribed: { $eq: false },
      customerEmail: { $eq: customer.email },
      segments: { $in: segmentsId },
    };
    const leads = await this.leadsService.getAllFromFilter(filterObject);

    return map(list, (item) => {
      const filteredLeads = filter(
        map(leads, (lead) => {
          if (lead.segments.includes(item.id)) {
            return get(lead, '_id');
          }
        }),
      );
      return {
        ...item,
        leads: filteredLeads,
      };
    });
  }

  async handleWebhook(event: Event): Promise<any> {
    if (event.model !== Models.SEGMENT) {
      return;
    }

    if (event.event === EventType.ENTRY_DELETE) {
      return this.leadsService.removeSegmentFromLeads(event?.entry.id);
    }
  }
}

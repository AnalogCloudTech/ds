import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CmsService } from '@/cms/cms/cms.service';
import { CmsPopulateBuilder } from '@/internal/utils/cms/populate/cms.populate.builder';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { find, get, map } from 'lodash';
import { CampaignsService } from '@/campaigns/email-campaigns/campaigns/services/campaigns.service';
import { CampaignDocument } from '@/campaigns/email-campaigns/campaigns/schemas/campaign.schema';
import { DataObject } from '@/cms/cms/types/common';
import { Content } from '@/cms/cms/types/content';
import { DateTime } from 'luxon';
import { Email } from '@/cms/cms/types/email';

@Injectable()
export class ContentsService {
  constructor(
    private readonly cmsService: CmsService,
    @Inject(forwardRef(() => CampaignsService))
    private readonly campaignsService: CampaignsService,
  ) {}

  async findAll(): Promise<Array<any>> {
    const query = {
      populate: ['emails', 'image'],
    };
    const queryString = CmsPopulateBuilder.build(query);
    return this.cmsService.contentsList(`?${queryString}`);
  }

  async findAllWithCustomerCampaignId(
    customer: CustomerDocument,
  ): Promise<Array<object>> {
    const query = {
      populate: ['emails', 'image'],
    };
    const queryString = CmsPopulateBuilder.build(query);
    const contents = await this.cmsService.contentsList(`?${queryString}`);
    const contentsId = map(contents, (content) => content.id);
    const campaigns = await this.campaignsService.getCustomerCampaignsByContent(
      customer,
      contentsId,
    );

    return map(contents, (content) => {
      const campaign = find(
        campaigns,
        (campaign: CampaignDocument) => campaign.contentId === content.id,
      );
      return {
        ...content,
        campaignId: get(campaign, '_id', null),
      };
    });
  }

  async details(id: number) {
    const details = await this.cmsService.contentDetails(id);
    const { emails } = details;
    const now = DateTime.now().startOf('day');
    let index = 0;
    let diff = DateTime.now().endOf('year').diff(DateTime.now().startOf('year'), 'hours').toObject().hours;

    //Find min diff
    emails.forEach((email, idx) => {
      const { absoluteMonth: month, absoluteDay: day } = email;
      const emailDate = DateTime.now().set({ month, day }).startOf('day');
      const diffDate = emailDate.diff(now, 'hours').toObject();
      const absDiff = Math.abs(diffDate.hours);
      if (diff > absDiff) {
        diff = absDiff;
        index = idx;
      }
    });

    // Taking emails eligible for being moved
    const toMove: Array<Email> = [];
    const toMoveIds: Array<number> = [];
    let foundId = false;
    emails.forEach((email, idx) => {
      if (!foundId) {
        if (idx === index) {
          foundId = true;
        } else {
            toMoveIds.push(email.id);
            toMove.push(email);
        }
      }
    });

    // removing past emails from the list
    const filteredList = emails.filter((email) => !toMoveIds.includes(email.id));

    // put the past emails on the end of the list
    return { ...details, emails: [...filteredList, ...toMove] };
  }

  async detailsRaw(id: number): Promise<DataObject<Content>> {
    return this.cmsService.contentDetailsRaw(id);
  }
}

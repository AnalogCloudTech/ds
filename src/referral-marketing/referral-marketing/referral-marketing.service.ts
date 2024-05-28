import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReferralMarketingDto } from './dto/create-referral-marketing.dto';
import { UpdateReferralMarketingDto } from './dto/update-referral-marketing.dto';
import {
  ReferralMarketing,
  ReferralDocument,
} from './schemas/referral-marketing.schema';
import { CommonHelper } from './helpers/common.helpers';
import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import { ReferralMarketingDomain } from './domain/referral-marketing-domain';
import { ChangeStatus } from './domain/types';

@Injectable()
export class ReferralMarketingService {
  constructor(
    @InjectModel(ReferralMarketing.name)
    private readonly referralModel: Model<ReferralDocument>,
    private readonly commonHelper: CommonHelper,
  ) {}
  async create(createReferralMarketingDto: CreateReferralMarketingDto) {
    createReferralMarketingDto.referralCode =
      this.commonHelper.randomGenerator();
    const referralMarketing = new this.referralModel(
      createReferralMarketingDto,
    );
    const ReferralMarketingSaved = await referralMarketing.save();
    return ReferralMarketingSaved;
  }

  async findAll(
    page: number,
    perPage: number,
    status: string,
    sorting: string,
  ): Promise<PaginatorSchematicsInterface> {
    let filterObject: object = {};
    let dateSorting;
    if (status != ChangeStatus.ALL) {
      filterObject = { changeStatus: status };
    }
    if (sorting) {
      dateSorting = sorting;
    }
    const skip = page * perPage;
    const total = await this.referralModel.find().countDocuments().exec();
    const referralMarketingList = (
      await this.referralModel
        .find(filterObject)
        .skip(skip)
        .limit(perPage)
        .sort({ 'memberDetails.submittedDate': dateSorting })
        .exec()
    ).map((item: ReferralDocument) => item as ReferralMarketingDomain);
    return PaginatorSchema.build(total, referralMarketingList, page, perPage);
  }

  async findOne(id: string) {
    const referralMarketingDetails = await this.referralModel.findById(id);
    return referralMarketingDetails;
  }

  async update(
    id: string,
    updateReferralMarketingDto: UpdateReferralMarketingDto,
  ) {
    return this.referralModel
      .findByIdAndUpdate(id, updateReferralMarketingDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.referralModel.findByIdAndDelete(id).exec();
  }
}

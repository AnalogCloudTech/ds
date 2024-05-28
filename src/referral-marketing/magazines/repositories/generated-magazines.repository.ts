import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { PaginatorSchema } from '@/internal/utils/paginator';
import {
  GeneratedMagazine,
  GeneratedMagazineDocument,
  GenerationStatus,
} from '@/referral-marketing/magazines/schemas/generated-magazine.schema';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { MagazineDocument } from '@/referral-marketing/magazines/schemas/magazine.schema';
import {
  GetAllGeneratedMagazinesMetricsDto,
  UpdateGeneratedMagazineStatusDto,
} from '@/referral-marketing/magazines/dto/update-generated-magazine-status.dto';
import { MagazineIds, MagazinePreviewType } from '../domain/types';
import { PreviewMagazineDto } from '../dto/preview-magazine.dto';
import { LeadCoversDto } from '../dto/create-magazine-cover-lead.dto';

@Injectable()
export class GeneratedMagazinesRepository {
  constructor(
    @InjectModel(GeneratedMagazine.name)
    private readonly generatedMagazineModel: Model<GeneratedMagazine>,
  ) {}

  async findGM(
    filter: FilterQuery<GeneratedMagazineDocument>,
    options: QueryOptions,
  ) {
    return this.generatedMagazineModel.find(filter, {}, options).exec();
  }

  async findOneGM(
    filter: FilterQuery<GeneratedMagazineDocument>,
    options: QueryOptions,
  ) {
    return this.generatedMagazineModel.findOne(filter, {}, options).exec();
  }

  async updateGM(
    where: FilterQuery<GeneratedMagazineDocument>,
    update: Partial<GeneratedMagazine>,
    options = <QueryOptions>{ new: true },
  ): Promise<GeneratedMagazineDocument> {
    return this.generatedMagazineModel
      .findOneAndUpdate(where, update, options)
      .exec();
  }

  async count(magazineIds: MagazineIds[]): Promise<number> {
    return this.generatedMagazineModel
      .countDocuments({
        magazine: { $in: magazineIds },
        status: GenerationStatus.DONE,
      })
      .exec();
  }

  public async create(
    customer: CustomerDocument,
    magazine: MagazineDocument,
    isPreview = false,
    createdByAutomation = false,
  ): Promise<GeneratedMagazineDocument> {
    // this is needed because user can not have more than one active magazine
    // which leads to having only one flipping book url
    await this.generatedMagazineModel.updateMany(
      { customer: customer._id, active: true },
      { active: false },
    );

    const lastMonth = await this.cloneLastGeneratedMagazineData(customer._id);
    const generatedMagazine = new this.generatedMagazineModel({
      pageUrl: lastMonth?.pageUrl || '',
      bookUrl: lastMonth?.bookUrl || '',
      magazine,
      customer: customer._id,
      isPreview,
      status: GenerationStatus.PENDING,
      createdByAutomation,
    });

    await generatedMagazine.save();

    return generatedMagazine.populate(['magazine', 'customer']);
  }

  public async upsert(
    customer: CustomerDocument,
    magazine: MagazineDocument,
    isPreview = false,
    createdByAutomation = false,
  ) {
    const generatedMagazineExists = await this.generatedMagazineModel.findOne({
      magazine: magazine._id,
      customer: customer._id,
      active: true,
    });

    if (!generatedMagazineExists) {
      return this.create(customer, magazine, isPreview, createdByAutomation);
    }

    return this.update(
      customer,
      { isPreview, status: GenerationStatus.PENDING, createdByAutomation },
      magazine,
    );
  }

  public async find(customer: CustomerDocument, active?: boolean) {
    const filter = { customer };

    if (active) {
      filter['active'] = active;
    }

    return this.generatedMagazineModel
      .find(filter)
      .populate(['customer', 'magazine']);
  }

  public async findById(
    generatedMagazineId: string,
    customer?: CustomerDocument,
  ) {
    const filter = { _id: generatedMagazineId };

    if (customer) {
      filter['customer'] = customer;
    }

    const generatedMagazine = await this.generatedMagazineModel
      .findOne(filter)
      .populate(['magazine', 'customer'])
      .exec();

    if (!generatedMagazine) {
      throw new HttpException(
        { message: 'generated magazine id not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return generatedMagazine;
  }

  public async findOne(customer: CustomerDocument, magazine: MagazineDocument) {
    const generatedMagazine = await this.generatedMagazineModel
      .findOne({
        magazine: magazine._id,
        active: true,
        customer,
      })
      .populate('magazine')
      .exec();

    if (!generatedMagazine) {
      throw new HttpException({ message: 'generated magazine not found' }, 404);
    }

    return generatedMagazine;
  }

  public async getMagazinePreview({
    id,
    email,
    year,
    month,
  }: PreviewMagazineDto) {
    let filterQuery = {};

    if (id) {
      filterQuery = {
        _id: new ObjectId(id),
      };
    } else {
      filterQuery = {
        'customerInfo.email': {
          $eq: email,
        },
      };
    }
    const magazinePreviewData = await this.generatedMagazineModel
      .aggregate<MagazinePreviewType>([
        {
          $lookup: {
            from: 'ds__customers',
            localField: 'customer',
            foreignField: '_id',
            as: 'customerInfo',
          },
        },
        {
          $lookup: {
            from: 'ds__referralMarketing__magazine',
            localField: 'magazine',
            foreignField: '_id',
            as: 'magazineInfo',
          },
        },
        {
          $match: {
            ...filterQuery,
          },
        },
        {
          $project: {
            magazine: 1,
            url: 1,
            status: 1,
            active: 1,
            flippingBookUrl: 1,
            coverImage: 1,
            pageUrl: 1,
            bookUrl: 1,
            pageStatus: 1,
            coversOnlyUrl: 1,
            createdAt: 1,
            updatedAt: 1,
            createdByAutomation: 1,
            customerInfo: {
              email: 1,
              firstName: 1,
              lastName: 1,
            },
            'magazineInfo.month': 1,
          },
        },
      ])
      .exec();

    let magazinePreview: MagazinePreviewType;

    const filterMagazineByDate = magazinePreviewData.forEach((magazine) => {
      Object.entries(magazine).forEach(([magazineKey, magazineValue]) => {
        if (magazineKey === 'createdAt') {
          const date = magazineValue.toString();
          const magazineDate = `${date.slice(4, 7)}-${date.slice(
            11,
            15,
          )}`.toLowerCase();
          const dateRequeried = `${month}-${year}`.toLowerCase();
          if (magazineDate === dateRequeried) {
            magazinePreview = magazine;
          }
        }
      });
    });

    if (month && year) {
      filterMagazineByDate;
    } else {
      magazinePreview = magazinePreviewData[0];
    }

    return magazinePreview;
  }

  public async getAllGeneratedMagazinesMetrics(
    page: number,
    perPage: number,
    skip: number,
    filterQuery: FilterQuery<GeneratedMagazineDocument>,
    status?: string,
  ): Promise<GetAllGeneratedMagazinesMetricsDto> {
    const pipeline = [
      {
        $match: {
          ...filterQuery,
        },
      },
      {
        $lookup: {
          from: 'ds__customers',
          localField: 'customer',
          foreignField: '_id',
          as: 'customerInfo',
        },
      },
      {
        $lookup: {
          from: 'ds__referralMarketing__magazine',
          localField: 'magazine',
          foreignField: '_id',
          as: 'magazineInfo',
        },
      },
      {
        $project: {
          'customerInfo.firstName': 1,
          'customerInfo.lastName': 1,
          'customerInfo.email': 1,
          'customerInfo.status': 1,
          'magazineInfo.status': 1,
          'magazineInfo.month': 1,
          year: 1,
          month: 1,
          createdAt: 1,
          updatedAt: 1,
          contentUrl: 1,
          magazine: 1,
          createdByAutomation: 1,
          isPreview: 1,
        },
      },
      {
        $unwind: {
          path: '$customerInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$magazineInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    if (status) {
      pipeline.push({
        $match: {
          'magazineInfo.status': status,
        },
      });
    }

    const allGeneratedMagazines = await this.generatedMagazineModel
      .aggregate<MagazinePreviewType>(pipeline)
      .limit(perPage)
      .skip(skip)
      .exec();

    const total = await this.generatedMagazineModel
      .countDocuments(filterQuery)
      .exec();

    const magazinesReportWithPagination = PaginatorSchema.build(
      total,
      allGeneratedMagazines,
      page,
      perPage,
    );

    return {
      magazinesDetails: magazinesReportWithPagination,
    };
  }

  public async getCountAllGeneratedMagazinesMetrics(
    filterQuery: FilterQuery<GeneratedMagazineDocument>,
  ): Promise<number> {
    return this.generatedMagazineModel.countDocuments(filterQuery).exec();
  }

  public async update(
    customer: CustomerDocument,
    generatedMagazineData: Partial<GeneratedMagazine>,
    magazine: MagazineDocument,
  ) {
    const generatedMagazine =
      await this.generatedMagazineModel.findOneAndUpdate(
        {
          magazine: magazine._id,
          active: true,
          customer,
        },
        { ...generatedMagazineData },
        { new: true },
      );

    if (!generatedMagazine) {
      throw new HttpException({ message: 'generated magazine not found' }, 404);
    }

    return generatedMagazine.populate(['magazine', 'customer']);
  }

  // TODO: maybe need to change this method name
  public async updateById(
    generatedMagazineId: string,
    {
      status,
      url,
      flippingBookUrl,
      coverImageHtml,
      pageUrl,
      pageStatus,
      bookUrl,
      coversOnlyUrl,
    }: UpdateGeneratedMagazineStatusDto,
  ) {
    const generatedMagazine =
      await this.generatedMagazineModel.findOneAndUpdate(
        { _id: generatedMagazineId },
        {
          status,
          url,
          flippingBookUrl,
          coverImage: coverImageHtml,
          pageUrl,
          pageStatus,
          bookUrl,
          coversOnlyUrl,
        },
        { new: true },
      );

    if (!generatedMagazine) {
      throw new HttpException({ message: 'generated magazine not found' }, 404);
    }

    return generatedMagazine;
  }

  public async updateLeadCoversById(
    generatedMagazineId: string,
    dto: LeadCoversDto,
  ): Promise<GeneratedMagazineDocument> {
    const leadData = {
      lead: new ObjectId(dto.lead),
      coversUrl: dto.coversUrl,
      fullContentUrl: dto.fullContentUrl,
    };
    const generatedMagazine =
      await this.generatedMagazineModel.findOneAndUpdate(
        { _id: generatedMagazineId },
        {
          $push: {
            leadCovers: leadData,
          },
        },
        { new: true },
      );

    if (!generatedMagazine) {
      throw new HttpException(
        { message: 'generated magazine not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return generatedMagazine;
  }

  private cloneLastGeneratedMagazineData(
    customer: Types.ObjectId,
  ): Promise<GeneratedMagazineDocument> {
    return this.generatedMagazineModel
      .findOne(
        {
          customer,
        },
        { sort: { createdAt: -1 } },
      )
      .exec();
  }

  public async findByMagazineId(
    generatedMagazineId: string,
  ): Promise<GeneratedMagazineDocument> {
    const generatedMagazine = await this.generatedMagazineModel
      .findOne({
        magazine: generatedMagazineId,
        active: true,
      })
      .populate(['magazine'])
      .exec();

    if (!generatedMagazine) {
      throw new HttpException(
        { message: 'generated magazine not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return generatedMagazine;
  }
}

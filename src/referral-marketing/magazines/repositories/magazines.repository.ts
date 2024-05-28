import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import {
  Magazine,
  MagazineDocument,
  MagazineStatus,
} from '@/referral-marketing/magazines/schemas/magazine.schema';
import { CreateMagazineStoreDto } from '@/referral-marketing/magazines/dto/create-magazine-store.dto';
import { Months } from '@/internal/utils/date';
import { PropertiesSanitizer } from '@/internal/utils/functions';
import { PaginatorSchema } from '@/internal/utils/paginator';
import { ListMagazineDto } from '@/referral-marketing/magazines/dto/list-magazine.dto';
import {
  CustomerType,
  MagazineMetricsType,
  MagazineReportsType,
  RmMagazineFilterQuery,
  RmStatusFilterQuery,
  TotalAggregateType,
} from '../domain/types';
import { isEmpty } from 'lodash';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { SchemaId } from '@/internal/types/helpers';
import { UpdateMagazineStatusDto } from '../dto/update-magazine-status.dto';

@Injectable()
export class MagazinesRepository {
  constructor(
    @InjectModel(Magazine.name)
    private readonly magazineModel: Model<MagazineDocument>,
  ) {}

  public async create({
    customer,
    magazineId,
    year,
    month,
    baseReplacers,
    contentUrl,
    createdByAutomation = false,
  }: CreateMagazineStoreDto): Promise<MagazineDocument> {
    const magazineExists = await this.magazineModel.findOne({
      customer,
      magazineId,
      year,
      month,
    });

    if (magazineExists) {
      throw new HttpException(
        { message: 'magazine already created' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const parsedMonth = <string>Months[`${month?.toLowerCase()}`] ?? '';

    if (!parsedMonth) {
      throw new HttpException(
        { message: 'could not parse month' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const lastMagazineData = await this.cloneLastMagazineData(customer);

    const magazine = new this.magazineModel({
      selections: lastMagazineData?.selections || [],
      month: parsedMonth,
      year,
      magazineId,
      customer: customer,
      baseReplacers: lastMagazineData?.baseReplacers || baseReplacers,
      contentUrl,
      createdByAutomation,
    });

    return magazine.save();
  }

  public async findOne(year: string, month: string, customerId?: SchemaId) {
    const parsedMonth = <string>Months[`${month?.toLowerCase()}`] ?? '';

    if (!parsedMonth) {
      throw new HttpException(
        { message: 'error parsing month' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const filter = {
      year,
      month: parsedMonth,
    };

    if (customerId) filter['customer'] = customerId;

    const magazine = await this.magazineModel.findOne(filter);

    if (!magazine) {
      throw new HttpException(
        { message: 'magazine not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return magazine;
  }

  /**
   * @deprecated use findAll instead
   */
  public async find({
    customer,
    month,
    year,
    page,
    perPage,
    sortOrder = 'desc',
    status,
  }: ListMagazineDto) {
    const parsedMonth = <string>Months[`${month?.toLowerCase()}`] ?? '';
    const filter = PropertiesSanitizer({
      customer: customer._id,
      month: parsedMonth,
      year,
      status,
    });

    const total = await this.magazineModel.find(filter).countDocuments().exec();
    page = page || 0;
    perPage = perPage || 25;
    const skip = page * perPage;

    const data = await this.magazineModel
      .find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(perPage)
      .exec();

    return PaginatorSchema.build<MagazineDocument>(total, data, page, perPage);
  }

  public async update(
    magazineId: SchemaId,
    updateQuery: UpdateQuery<Magazine>,
    options: QueryOptions = { new: true },
  ) {
    return this.magazineModel
      .findByIdAndUpdate(magazineId, updateQuery, options)
      .exec();
  }

  async updateStatusByMagazineId(
    id: string,
    { status }: UpdateMagazineStatusDto,
  ): Promise<MagazineDocument> {
    const newStatus = { status: status };

    const updated = await this.magazineModel
      .findByIdAndUpdate(id, newStatus, { new: true })
      .exec();

    return updated;
  }

  public async getMagazinesMetrics(
    filterQuery: RmMagazineFilterQuery,
    pageVisits: RmStatusFilterQuery,
    sentToPrint: RmStatusFilterQuery,
    magazineGeneratedCount: number,
  ) {
    const [totalCount, pageVisitsCount, sentToPrintCount] = await Promise.all([
      this.magazineModel.countDocuments(filterQuery).exec(),
      this.magazineModel.countDocuments(pageVisits).exec(),
      this.magazineModel.countDocuments(sentToPrint).exec(),
    ]);

    if (totalCount === 0) {
      magazineGeneratedCount = 0;
    }

    return {
      PageVistedCount: pageVisitsCount,
      MagazineGeneratedCount: magazineGeneratedCount,
      SentToPrintCount: sentToPrintCount,
    };
  }

  public async getMagazinesMetricsTableData(
    page: number,
    perPage: number,
    skip: number,
    filterQuery: RmMagazineFilterQuery,
  ) {
    const [totalCount] = await Promise.all([
      this.magazineModel.countDocuments(filterQuery).exec(),
    ]);

    const magazinesReports = await this.magazineModel
      .aggregate([
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
            from: 'ds__referralMarketing__generatedMagazine',
            localField: '_id',
            foreignField: 'magazine',
            as: 'generatedMagazine',
          },
        },
        {
          $project: {
            'customerInfo.firstName': 1,
            'customerInfo.lastName': 1,
            'customerInfo.email': 1,
            'customerInfo.status': 1,
            'generatedMagazine._id': 1,
            'generatedMagazine.status': 1,
            'generatedMagazine.updatedAt': 1,
            'generatedMagazine.createdByAutomation': 1,
            'generatedMagazine.active': 1,
            'generatedMagazine.customer': 1,
            year: 1,
            month: 1,
            status: 1,
            customer: 1,
            createdAt: 1,
            updatedAt: 1,
            contentUrl: 1,
          },
        },
        {
          $unwind: {
            path: '$customerInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .skip(skip)
      .limit(perPage)
      .exec();

    const magazinesReportWithPaginaton = PaginatorSchema.build(
      totalCount,
      magazinesReports,
      page,
      perPage,
    );
    return {
      magazinesDetails: magazinesReportWithPaginaton,
    };
  }

  public async getMagazineMetricsByStatus(
    page: number,
    perPage: number,
    skip: number,
    filterQuery: RmMagazineFilterQuery,
  ) {
    const magazinesReports = await this.magazineModel
      .aggregate([
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
            from: 'ds__referralMarketing__generatedMagazine',
            localField: '_id',
            foreignField: 'magazine',
            as: 'generatedMagazine',
          },
        },
        {
          $project: {
            'customerInfo.firstName': 1,
            'customerInfo.lastName': 1,
            'customerInfo.email': 1,
            'customerInfo.status': 1,
            'generatedMagazine._id': 1,
            'generatedMagazine.status': 1,
            'generatedMagazine.updatedAt': 1,
            'generatedMagazine.createdByAutomation': 1,
            year: 1,
            month: 1,
            status: 1,
            customer: 1,
            createdAt: 1,
            updatedAt: 1,
            contentUrl: 1,
          },
        },
        {
          $unwind: {
            path: '$customerInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .skip(skip)
      .limit(perPage)
      .exec();

    const total = await this.magazineModel
      .aggregate<TotalAggregateType>([
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
            from: 'ds__referralMarketing__generatedMagazine',
            localField: '_id',
            foreignField: 'magazine',
            as: 'generatedMagazine',
          },
        },
        {
          $count: 'total',
        },
      ])
      .exec();

    const totalCount = total.pop()?.total;

    const magazinesReportWithPaginaton = PaginatorSchema.build(
      totalCount,
      magazinesReports,
      page,
      perPage,
    );
    return {
      magazinesDetails: magazinesReportWithPaginaton,
    };
  }

  public async getAllMagazinesMetrics(
    filterQuery: RmMagazineFilterQuery,
  ): Promise<MagazineMetricsType[]> {
    const allMagazinesReports = await this.magazineModel
      .aggregate<MagazineMetricsType>([
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
            from: 'ds__referralMarketing__generatedMagazine',
            localField: '_id',
            foreignField: 'magazine',
            as: 'generatedMagazine',
          },
        },
        {
          $project: {
            'customerInfo.firstName': 1,
            'customerInfo.lastName': 1,
            'customerInfo.email': 1,
            'customerInfo.status': 1,
            'generatedMagazine._id': 1,
            'generatedMagazine.status': 1,
            'generatedMagazine.updatedAt': 1,
            'generatedMagazine.createdByAutomation': 1,
            year: 1,
            month: 1,
            status: 1,
            customer: 1,
            createdAt: 1,
            updatedAt: 1,
            contentUrl: 1,
          },
        },
        {
          $unwind: {
            path: '$customerInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .exec();

    return allMagazinesReports;
  }

  // TODO: refactor this function
  async getMagazinesMetricsBySearch(
    searchQuery: string,
    filterQuery: RmMagazineFilterQuery,
    page: number,
    perPage: number,
  ) {
    const searchRegex = new RegExp(`^${searchQuery}$`, 'i');

    const matchWithSearchQuery = searchQuery
      ? {
          $or: [
            { 'customerInfo.email': searchRegex },
            { 'customerInfo.firstName': searchRegex },
            { 'customerInfo.lastName': searchRegex },
          ],
        }
      : {};

    const skip = page * perPage;
    const magazinesReports = await this.magazineModel
      .aggregate<MagazineReportsType>([
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
            from: 'ds__referralMarketing__generatedMagazine',
            localField: '_id',
            foreignField: 'magazine',
            as: 'generatedMagazine',
          },
        },
        {
          $match: matchWithSearchQuery,
        },
        {
          $project: {
            'customerInfo.firstName': 1,
            'customerInfo.lastName': 1,
            'customerInfo.email': 1,
            'customerInfo.status': 1,
            'generatedMagazine._id': 1,
            'generatedMagazine.status': 1,
            'generatedMagazine.updatedAt': 1,
            'generatedMagazine.createdByAutomation': 1,
            year: 1,
            month: 1,
            status: 1,
            customer: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
        {
          $unwind: {
            path: '$customerInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .skip(skip)
      .limit(perPage);

    let magazinesReportByEmail: MagazineReportsType[] = [];
    if (searchQuery) {
      magazinesReports.filter((magazine) => {
        if (
          magazine.status.toLowerCase().replace('_', ' ') ===
          searchQuery.toLowerCase()
        ) {
          magazinesReportByEmail.push(magazine);
        }
      });

      const getCustomerByEmail = (
        customerInfoKey: string,
        customerInfoValue: CustomerType,
        customerInfoData: MagazineReportsType,
      ) => {
        if (
          customerInfoKey === 'customerInfo' &&
          typeof customerInfoValue == 'object'
        ) {
          Object.entries(customerInfoValue).forEach(
            ([customerInfoKey, customerInfoValue]) => {
              const condition =
                customerInfoValue.toLowerCase() === searchQuery.toLowerCase();

              if (customerInfoKey === 'email' && condition) {
                magazinesReportByEmail.push(customerInfoData);
              } else if (customerInfoKey === 'firstName' && condition) {
                magazinesReportByEmail.push(customerInfoData);
              } else if (customerInfoKey === 'lastName' && condition) {
                magazinesReportByEmail.push(customerInfoData);
              }
            },
          );
        }
      };
      magazinesReports.forEach((customerInfoData: MagazineReportsType) => {
        Object.entries(customerInfoData).forEach(
          ([customerInfoKey, customerInfoValue]) => {
            getCustomerByEmail(
              customerInfoKey,
              <CustomerType>customerInfoValue,
              customerInfoData,
            );
          },
        );
      });
      if (isEmpty(magazinesReportByEmail)) {
        magazinesReportByEmail = magazinesReports.filter((result) => {
          if (searchQuery.toUpperCase().startsWith('SENT')) {
            return result.status === MagazineStatus.SENT_FOR_PRINTING;
          }
          if (searchQuery.toUpperCase().startsWith('MAGAZINE')) {
            return result.status === MagazineStatus.MAGAZINE_GENERATED;
          }
          if (searchQuery.toUpperCase() === MagazineStatus.EDITING) {
            return result;
          }
        });
      }
    } else {
      magazinesReportByEmail = magazinesReports;
    }

    const magazinesReportsTotal = magazinesReportByEmail.length;

    const magazinesReportWithPaginaton =
      PaginatorSchema.build<MagazineReportsType>(
        magazinesReportsTotal,
        magazinesReportByEmail,
        page,
        perPage,
      );

    return {
      magazinesDetails: magazinesReportWithPaginaton,
    };
  }

  private cloneLastMagazineData(
    customer: CustomerDocument | SchemaId,
  ): Promise<MagazineDocument> {
    return this.magazineModel
      .findOne(
        {
          customer,
        },
        {},
        { sort: { createdAt: -1 } },
      )
      .exec();
  }

  async findAll(
    filter: FilterQuery<MagazineDocument>,
    projection = null,
    options = <QueryOptions>{ skip: 0, limit: 25, lean: true },
  ): Promise<MagazineDocument[]> {
    return this.magazineModel.find(filter, projection, options);
  }

  async findMagazine(
    filter: FilterQuery<MagazineDocument>,
    projection = {},
    options = <QueryOptions>{ skip: 0, limit: 25, lean: true },
  ): Promise<MagazineDocument> {
    return this.magazineModel.findOne(filter, projection, options);
  }

  public async updateOne(
    filter: FilterQuery<MagazineDocument>,
    updateQuery: UpdateQuery<MagazineDocument>,
    options: QueryOptions,
  ) {
    return this.magazineModel.updateOne(filter, options);
  }

  public async updateMany(
    filter: FilterQuery<MagazineDocument>,
    updateQuery: UpdateQuery<MagazineDocument>,
    options: QueryOptions,
  ) {
    return this.magazineModel.updateMany(filter, options);
  }
}

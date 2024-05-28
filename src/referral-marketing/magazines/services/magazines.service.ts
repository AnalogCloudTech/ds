import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateMagazineDto } from '../dto/create-magazine.dto';
import { UpdateMagazineDto } from '../dto/update-magazine.dto';
import { GetAllReportMetricsDto } from '../dto/get-all-report-metrics.dto';
import { CmsService } from '@/cms/cms/cms.service';
import { MagazinesRepository } from '@/referral-marketing/magazines/repositories/magazines.repository';
import {
  Cover,
  RmMagazineFilterQuery,
  RmStatusFilterQuery,
  Selection,
} from '@/referral-marketing/magazines/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { ListMagazineDto } from '@/referral-marketing/magazines/dto/list-magazine.dto';
import {
  Magazine,
  MagazineDocument,
  MagazineStatus,
} from '../schemas/magazine.schema';
import { TurnMonthDto } from '@/referral-marketing/magazines/dto/turn-month.dto';
import { GeneratedMagazinesService } from '@/referral-marketing/magazines/services/generated-magazines.service';
import {
  ReferralMarketingCoverDesignOption,
  ReferralMarketingMagazine,
} from '@/cms/cms/types/referral-marketing-magazine';
import { DataObject } from '@/cms/cms/types/common';
import { sleep } from '@/internal/utils/functions';
import { MonthsType } from '@/internal/utils/date';
import { UpdateMagazineStatusDto } from '../dto/update-magazine-status.dto';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { SchemaId } from '@/internal/types/helpers';
import { CreateMagazineStoreDto } from '@/referral-marketing/magazines/dto/create-magazine-store.dto';
import {
  FRONT_INSIDE_COVER_OPTION_1,
  FRONT_INSIDE_COVER_TEXT,
} from '@/referral-marketing/magazines/constants';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';
import { CONTEXT_SERVICE_MAGAZINE } from '@/internal/common/contexts';

@Injectable()
export class MagazinesService {
  constructor(
    @Inject(forwardRef(() => GeneratedMagazinesService))
    private readonly generatedMagazinesService: GeneratedMagazinesService,
    private readonly magazinesRepository: MagazinesRepository,
    private readonly cmsService: CmsService,
    private readonly logger: Logger,
  ) {}

  async first(filter: FilterQuery<MagazineDocument>, options?: QueryOptions) {
    return this.magazinesRepository.findMagazine(filter, {}, options);
  }

  async find(filter: FilterQuery<MagazineDocument>, options?: QueryOptions) {
    return this.magazinesRepository.findAll(filter, options);
  }

  async create(
    customer: CustomerDocument,
    createMagazineDto: CreateMagazineDto,
  ) {
    const {
      attributes: {
        month,
        year,
        pdf: {
          data: {
            attributes: { url },
          },
        },
      },
    } = await this.cmsService.magazineDetails(createMagazineDto.magazineId);

    const mag = await this.magazinesRepository.create({
      month,
      year,
      customer: customer._id,
      magazineId: createMagazineDto.magazineId,
      baseReplacers: createMagazineDto.baseReplacers || [],
      contentUrl: url,
      createdByAutomation: !!createMagazineDto.createdByAutomation,
    });

    await this.updateSelections(month, year, mag);

    return mag;
  }

  async findAll(list: ListMagazineDto) {
    return this.magazinesRepository.findAll(list);
  }

  /**
   * @deprecated
   */
  async updateMag(
    magazineId: SchemaId,
    update: Partial<Magazine>,
    options?: QueryOptions,
  ) {
    return this.magazinesRepository.update(magazineId, update, options);
  }

  async findOne(customer: CustomerDocument, year: string, month: string) {
    return this.magazinesRepository.findOne(year, month, customer._id);
  }

  /**
   * @deprecated
   */
  async update(
    customer: CustomerDocument,
    year: string,
    month: string,
    updateMagazineDto: UpdateMagazineDto,
  ) {
    const magazineExists = await this.magazinesRepository.findOne(
      year,
      month,
      customer._id,
    );

    if (!magazineExists)
      throw new HttpException(
        { message: 'magazine not found' },
        HttpStatus.NOT_FOUND,
      );

    const { selection } = updateMagazineDto;
    const filteredSelections = magazineExists.selections.reduce((acc, idx) => {
      if (selection && idx.page === selection.page) {
        return acc;
      }
      acc.push(idx);
      return acc;
    }, [] as Selection[]);

    if (selection) {
      filteredSelections.push(selection);
    }

    const selections = filteredSelections;
    const selectionHasData = Object.keys(selection || {});
    if (selectionHasData?.length && !selection?.formKeyword)
      throw new HttpException(
        { message: 'missing formKeyword' },
        HttpStatus.BAD_REQUEST,
      );

    const magazineInfo = await this.cmsService.magazineDetails(
      magazineExists.magazineId,
    );

    const cover = await this.processCover(selection, magazineInfo);

    const filteredCovers = magazineExists.covers.reduce((acc, idx) => {
      if (cover && idx.order === cover.order) {
        return acc;
      }
      acc.push(idx);
      return acc;
    }, [] as Cover[]);

    if (cover) {
      filteredCovers.push(cover);
    }

    const covers = filteredCovers;

    return this.magazinesRepository.update(
      magazineExists._id,
      { ...updateMagazineDto, selections, covers },
      {
        new: true,
      },
    );
  }

  /**
   * @deprecated
   */
  async updateStatusByMagazineId(id: string, dto: UpdateMagazineStatusDto) {
    return this.magazinesRepository.updateStatusByMagazineId(id, dto);
  }

  async getMagazinePages(filters: { month: string; year: string }) {
    const response = await this.cmsService.magazineData(filters);
    if (response?.length > 0) {
      const data = response[0];
      return {
        id: data.id,
        month: data.attributes.month,
        year: data.attributes.year,
        pdf: data.attributes.pdf.data.attributes.url,
        previewPdf: data.attributes.previewPdf.data.attributes.url,
        frontCoverDesign: this.mapDisplayImageMagazine(
          data.attributes.frontCoverDesign,
        ),
        frontCoverStrip: this.mapDisplayImageMagazine(
          data.attributes.frontCoverStrip,
        ),
        frontInsideCover: this.mapDisplayImageMagazine(
          data.attributes.frontInsideCover,
        ),
        backInsideCover: this.mapDisplayImageMagazine(
          data.attributes.backInsideCover,
        ),
        backCover: this.mapDisplayImageMagazine(data.attributes.backCover),
      };
    }
    return null;
  }

  async processCover(
    selection: Selection,
    magazineInfo: DataObject<ReferralMarketingMagazine>,
  ): Promise<Cover> {
    let html = await this.processMagazineData(
      selection?.formKeyword,
      magazineInfo.attributes,
    );

    // TODO: better handling still to be implement
    // if (!html) {
    //   throw new HttpException(
    //     { message: 'could not found matching html for this form-keyword' },
    //     500,
    //   );
    // }

    const replacers = selection?.dynamicFields;

    if (selection?.extraHtml) {
      const {
        formKeyword = '',
        dynamicFields,
        htmlReplacer,
      } = selection?.extraHtml;
      const extraHtml = await this.processMagazineData(
        formKeyword,
        magazineInfo.attributes,
      );

      html = html.replace(`{{${htmlReplacer}}}`, extraHtml);

      if (dynamicFields?.length) {
        replacers.push(...dynamicFields);
      }
    }

    return {
      html,
      replacers,
      name: selection?.formKeyword,
      order: selection?.page,
    };
  }

  private processMagazineData(
    formKeyword: string,
    attributes: ReferralMarketingMagazine,
  ): Promise<string> {
    let form: any = null;
    Object.keys(attributes).forEach((key) => {
      if (Array.isArray(attributes[key]) && !form) {
        // TODO: review logic
        // eslint-disable-next-line
        form = attributes[key].find((a) => a.formKeyword === formKeyword);
      }
    });

    if (!form) return null;
    // eslint-disable-next-line
    return form.html;
  }

  async getMagazinesMetrics(year: string, month: MonthsType) {
    let filterQuery: RmMagazineFilterQuery;
    let pageVisits: RmStatusFilterQuery;
    let sentToPrint: RmStatusFilterQuery;

    if (year && month) {
      filterQuery = {
        year,
        month,
      };
      pageVisits = {
        ...filterQuery,
        status: MagazineStatus.EDITING,
      };
      sentToPrint = {
        ...filterQuery,
        status: MagazineStatus.SENT_FOR_PRINTING,
      };
    }

    const magazineGeneratedCount: number =
      await this.generatedMagazinesService.getCountAllGeneratedMagazinesMetrics(
        year,
        month,
      );

    return this.magazinesRepository.getMagazinesMetrics(
      filterQuery,
      pageVisits,
      sentToPrint,
      magazineGeneratedCount,
    );
  }

  async getMagazinesMetricsTableData(
    page: number,
    perPage: number,
    year: string,
    month: MonthsType,
  ) {
    let filterQuery: RmMagazineFilterQuery;

    if (year && month) {
      filterQuery = {
        year,
        month,
      };
    }

    const skip = page * perPage;
    return this.magazinesRepository.getMagazinesMetricsTableData(
      page,
      perPage,
      skip,
      filterQuery,
    );
  }

  async getMagazineEditingMetrics(
    page: number,
    perPage: number,
    year: string,
    month: string,
  ) {
    let filterQuery: RmStatusFilterQuery;

    if (year && month) {
      filterQuery = {
        year,
        month,
        status: MagazineStatus.EDITING,
      };
    }

    const skip = page * perPage;
    return this.magazinesRepository.getMagazineMetricsByStatus(
      page,
      perPage,
      skip,
      filterQuery,
    );
  }

  async getMagazineSentToPrintMetrics(
    page: number,
    perPage: number,
    year: string,
    month: string,
  ) {
    let filterQuery: RmStatusFilterQuery;

    if (year && month) {
      filterQuery = {
        year,
        month,
        status: MagazineStatus.SENT_FOR_PRINTING,
      };
    }

    const skip = page * perPage;
    return this.magazinesRepository.getMagazineMetricsByStatus(
      page,
      perPage,
      skip,
      filterQuery,
    );
  }

  async getAllMagazinesMetrics({ year, month }: GetAllReportMetricsDto) {
    let filterQuery: RmMagazineFilterQuery;

    if (year && month) {
      filterQuery = {
        year,
        month,
      };
    }

    return this.magazinesRepository.getAllMagazinesMetrics(filterQuery);
  }

  async getMagazinesMetricsBySearch(
    searchQuery: string,
    year: string,
    month: string,
    page: number,
    perPage: number,
  ) {
    let filterQuery: RmMagazineFilterQuery;

    if (year && month) {
      filterQuery = {
        year,
        month,
      };
    }

    return this.magazinesRepository.getMagazinesMetricsBySearch(
      searchQuery,
      filterQuery,
      page,
      perPage,
    );
  }

  async getBaseReplacers(magazineId: SchemaId, customerId: SchemaId) {
    const magazine = await this.magazinesRepository.findMagazine({
      _id: magazineId,
      customer: customerId,
    });

    if (!magazine) {
      throw new HttpException(
        { message: 'magazine not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (magazine.baseReplacers && magazine.baseReplacers.length > 0) {
      return magazine.baseReplacers;
    }

    const lastMonthMagazine = await this.magazinesRepository.findMagazine(
      {
        id: { $ne: magazine._id },
        baseReplacers: { $size: 1 },
        customer: customerId,
      },
      {},
      { sort: { createdAt: -1 } },
    );

    if (!lastMonthMagazine) {
      throw new HttpException(
        { message: 'could not find base replacers' },
        HttpStatus.NOT_FOUND,
      );
    }

    return lastMonthMagazine.baseReplacers;
  }

  /**
   * Update all selection inside a magazine so cover can be generated and also
   * replace selection for default value on frontInsideCover-option-1
   *
   *
   * @param month - month of the magazine
   * @param year - year of the magazine
   * @param mag - magazine
   *
   * @returns The list of magazine which should be created for current month
   */
  private async updateSelections(month: string, year: string, mag: Magazine) {
    try {
      const { customer, selections } = mag;

      const magazineDetails = await this.cmsService.magazineData({
        month,
        year,
      });

      if (!magazineDetails?.length) {
        throw new HttpException(
          { message: `couldn't find magazine details in cms` },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const {
        attributes: { month: monthCMS, year: yearCMS, ...rest },
      } = magazineDetails.pop();

      for await (const selection of selections) {
        selection.formKeyword = selection?.formKeyword?.trim();

        if (selection.formKeyword === FRONT_INSIDE_COVER_OPTION_1) {
          const frontInsideCover = rest.frontInsideCover.pop();
          const defaultValue = frontInsideCover?.defaultText;

          selection.dynamicFields.forEach(({ keyword }, idx) => {
            if (keyword === FRONT_INSIDE_COVER_TEXT) {
              const formattedValue = defaultValue?.replace(
                /(?:\r\n|\r|\n)/g,
                '<br />',
              );
              selection.dynamicFields[idx].value = formattedValue;
            }
          });
        }

        await this.update(customer as CustomerDocument, yearCMS, monthCMS, {
          selection,
        });

        // TODO: remove this when we have a better way to retrieve magazine details
        // sleep is necessary to avoid downtimes in CMS server
        await sleep(1000);
      }
    } catch (err) {
      if (err instanceof Error) {
        this.logger.log(
          {
            payload: <LoggerPayload>{
              usageDate: DateTime.now(),
              message: `Error - ${err}`,
            },
          },
          CONTEXT_SERVICE_MAGAZINE,
        );

        throw new HttpException(
          { message: 'error while updating selections', error: err },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  mapDisplayImageMagazine = (
    magazineData = <ReferralMarketingCoverDesignOption[]>[],
  ) =>
    magazineData?.map((magazine) => ({
      ...magazine,
      displayImage: magazine?.displayImage?.data?.attributes?.url,
    }));

  /**
   * Returns all customer which had a magazine last month and didn't finish creating in current one
   *
   *
   * @param dto - Object with current month, current year, last month and last year
   *
   * @returns The list of magazine which should be created for current month
   */
  public async getMagazineCustomerWithoutMagazine({
    lastData,
    currentData,
  }: TurnMonthDto) {
    const [magazineOwnersFromLastMonth, magazineOwnersFromCurrentMonth] =
      await Promise.all([
        this.magazinesRepository.findAll(
          {
            year: lastData.year,
            month: lastData.month,
            status: MagazineStatus.SENT_FOR_PRINTING,
          },
          {},
          {
            limit: 0,
            skip: 0,
            populate: ['customer'],
            lean: true,
            readPreference: 'secondaryPreferred',
          },
        ),
        this.magazinesRepository.findAll(
          {
            year: currentData.year,
            month: currentData.month,
            $or: [{ status: MagazineStatus.SENT_FOR_PRINTING }],
          },
          { _id: 0, customer: 1 },
          {
            skip: 0,
            limit: 0,
            lean: true,
            readPreference: 'secondaryPreferred',
          },
        ),
      ]);

    const magazineOwnersOccurrence = new Map<string, number>();
    const magazinesToBeCloned: Array<Magazine> = [];

    // next block of code create a map with all occurrence of magazines from current month
    // then we can check if the customer had a magazine in the last month and
    // create one similar to him
    magazineOwnersFromCurrentMonth.forEach(({ customer }) => {
      magazineOwnersOccurrence.set(customer.toString(), 1);
    });

    magazineOwnersFromLastMonth.forEach(({ customer, ...rest }) => {
      const magazineExists = magazineOwnersOccurrence.get(
        customer._id.toString(),
      );

      if (!magazineExists && customer && rest.baseReplacers?.length > 0) {
        magazinesToBeCloned.push({ customer, ...rest });
      }
    });

    return magazinesToBeCloned;
  }

  /**
   * Update and return a magazine
   *
   * @Param filter - Filter to find the magazine
   * @Param update - Updated fields
   * @Param options - Options to update the magazine
   *
   * @returns - Magazine document
   */
  public async updateOne(
    filter: FilterQuery<MagazineDocument>,
    update: UpdateQuery<MagazineDocument>,
    options: QueryOptions,
  ) {
    return this.magazinesRepository.updateOne(filter, update, options);
  }

  /**
   * Update and return a magazine
   *
   * @Param filter - Filter to find the magazine
   * @Param update - Updated fields
   * @Param options - Options to update the magazine
   *
   * @returns - Array with magazine documents
   */
  public async updateMany(
    filter: FilterQuery<MagazineDocument>,
    update: UpdateQuery<MagazineDocument>,
    options: QueryOptions,
  ) {
    return this.magazinesRepository.updateMany(filter, update, options);
  }

  public async adminCreate(dto: CreateMagazineStoreDto) {
    return this.magazinesRepository.create(dto);
  }
}

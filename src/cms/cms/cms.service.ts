import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Axios } from 'axios';
import { first, get, map, pick } from 'lodash';
import {
  HEALTH_CHECK,
  replaceRouteParameter,
  ROUTE_APP_CONFIG,
  ROUTE_CONTENTS_DETAILS,
  ROUTE_CONTENTS_LIST,
  ROUTE_PAYMENT_PLANS,
  ROUTE_REFERRAL_MARKETING_MAGAZINE,
  ROUTE_SEGMENTS_LIST,
  ROUTE_SOCIAL_MEDIA_CONFIG,
  ROUTE_SOCIAL_MEDIA_CONTENTS_DETAILS,
  ROUTE_SOCIAL_MEDIA_CONTENTS_LIST,
  ROUTE_SOCIAL_MEDIA_TEMPLATES_DETAILS,
  ROUTE_SOCIAL_MEDIA_TEMPLATES_LIST,
  ROUTE_TEMPLATES_CREATE,
  ROUTE_TEMPLATES_DELETE,
  ROUTE_TEMPLATES_DETAILS,
  ROUTE_TEMPLATES_LIST,
  ROUTE_TEMPLATES_UPDATE,
} from '@/cms/cms/routes';
import {
  DataObject,
  PublicationState,
  QueryParams,
  ResponseArrayObject,
} from './types/common';
import { CreateTemplate, Template, TemplateDetails } from './types/template';
import { CmsPopulateBuilder } from '@/internal/utils/cms/populate/cms.populate.builder';
import {
  CmsFilterBuilder,
  CmsFilterObject,
} from '@/internal/utils/cms/filters/cms.filter.builder';
import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { ReferralMarketingMagazine } from './types/referral-marketing-magazine';
import {
  ChargifyUpgradePathDto,
  ChargifyUpgradePathResponseDto,
} from '@/onboard/dto/chargify-upgrade-path.dto';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './types/types';
import { Content } from '@/cms/cms/types/content';
import { ProductPackages } from '@/legacy/dis/legacy/payments/types';

@Injectable()
export class CmsService {
  constructor(
    @Inject('HTTP_CMS') private readonly http: Axios,
    private readonly configService: ConfigService,
  ) {}

  async passthruGet(url: string) {
    return this.http.get(url);
  }

  public templateListWithPagination<T = any>(
    query: QueryParams | string = '',
  ): Promise<PaginatorSchematicsInterface> {
    return this.generalListWithPagination<T>(ROUTE_TEMPLATES_LIST, query);
  }

  async templateListDropdown() {
    const allItems: Array<Template> = [];
    let page = 1;
    // STRAPI limitation
    const perPage = 100;
    let goOn = true;
    do {
      const query: QueryParams = {
        fields: ['id', 'name', 'customerId'],
        publicationState: PublicationState.LIVE,
        pagination: {
          page,
          pageSize: perPage,
        },
      };
      const result = await this.templateListWithPagination(query);
      const { data, meta } = result;
      if (data) {
        // TODO: verify typing
        data.forEach((item) => {
          // eslint-disable-next-line
          if (!item?.customerId) {
            // eslint-disable-next-line
            allItems.push(item);
          }
        });
      }

      goOn = page !== meta?.lastPage;
      page++;
    } while (goOn);

    return allItems;
  }

  async templateDetails(
    id: number,
    queryString: QueryParams | string = '?populate=*',
  ): Promise<TemplateDetails> {
    const query = this.validateQueryString(queryString);
    const template: DataObject<Template> = await this.generalDetails(
      ROUTE_TEMPLATES_DETAILS,
      id,
      query,
    );

    if (!template) {
      return null;
    }

    const {
      // image,
      bodyContent,
      content,
      createdAt,
      customerId,
      imageUrl,
      name,
      subject,
      templateTitle,
    } = template.attributes;
    // TODO: We need to decide how to deal with image/imageUrl
    // const imageUrl = <string>get(image, ['data', 'attributes', 'url'], null);
    return <TemplateDetails>{
      bodyContent,
      content,
      createdAt,
      customerId,
      id,
      imageUrl,
      name,
      subject,
      templateTitle,
    };
  }

  async socialTemplatesList(
    queryString: QueryParams | string = '',
  ): Promise<PaginatorSchematicsInterface> {
    const query = this.validateQueryString(queryString);
    const pagination: PaginatorSchematicsInterface =
      await this.generalListWithPagination(
        ROUTE_SOCIAL_MEDIA_TEMPLATES_LIST,
        query,
      );

    const { data } = pagination;

    pagination.data = map(data, (template) => {
      return pick(template, ['id', 'name', 'subject', 'createdAt']);
    });

    return pagination;
  }

  async socialMediaTemplateDetails(
    id: number,
    queryString: QueryParams | string = '?populate=*',
  ) {
    const query = this.validateQueryString(queryString);
    const template: DataObject<Template> = await this.generalDetails(
      ROUTE_SOCIAL_MEDIA_TEMPLATES_DETAILS,
      id,
      query,
    );

    const templateData = pick(template.attributes, [
      'name',
      'content',
      'subject',
      'templateTitle',
      'bodyContent',
      'imageUrl',
      'createdAt',
      'customerId',
    ]);
    const { image } = template.attributes;
    const imageUrl = get(image, ['data', 'attributes', 'url'], null);

    // Fetch social media name
    const queryStringSocial = {
      populate: {
        social_media: {
          populate: {
            socialMedia: '*',
          },
        },
      },
    };
    try {
      const queryMedia = this.validateQueryString(queryStringSocial);

      const socialMediaDetail: DataObject<Template> = await this.generalDetails(
        ROUTE_SOCIAL_MEDIA_TEMPLATES_DETAILS,
        id,
        queryMedia,
      );

      const socialMedia = get(socialMediaDetail, [
        'attributes',
        'social_media',
        'socialMedia',
        'data',
        'attributes',
        'name',
      ]);

      return {
        ...templateData,
        imageUrl,
        socialMedia,
      };
    } catch (e) {
      throw new NotFoundException('Social Media not found');
    }
  }

  async socialMediaMultipleTemplateDetails(
    templateArray: Array<number>,
    queryString: QueryParams | string = '?populate=*',
  ) {
    const response = [];
    for (const id of templateArray) {
      const query = this.validateQueryString(queryString);
      const template: DataObject<Template> = await this.generalDetails(
        ROUTE_SOCIAL_MEDIA_TEMPLATES_DETAILS,
        id,
        query,
      );
      const templateData = pick(template.attributes, [
        'name',
        'content',
        'subject',
        'createdAt',
      ]);
      templateData['id'] = template.id;
      const { image } = template.attributes;
      const imageUrl = get(image, ['data', 'attributes', 'url'], null);

      // Fetch social media name
      const queryStringSocial = {
        populate: {
          social_media: {
            populate: {
              socialMedia: '*',
            },
          },
        },
      };
      const queryMedia = this.validateQueryString(queryStringSocial);
      const socialMediaDetail: DataObject<Template> = await this.generalDetails(
        ROUTE_SOCIAL_MEDIA_TEMPLATES_DETAILS,
        id,
        queryMedia,
      );
      const socialMedia = get(socialMediaDetail, [
        'attributes',
        'social_media',
        'socialMedia',
        'data',
        'name',
      ]);

      response.push({
        ...templateData,
        imageUrl,
        socialMedia,
      });
    }
    return response;
  }

  async segmentsList(queryString: string) {
    const data = await this.generalList(ROUTE_SEGMENTS_LIST, queryString);

    return data.map((segment) => {
      const id = segment.id;
      const { name } = segment.attributes;
      return { id, name };
    });
  }

  async contentsList(queryString = '') {
    const data = await this.generalList(ROUTE_CONTENTS_LIST, queryString);
    const contents = data.map((content) => {
      const id = content.id;
      const { name, emails } = content.attributes;
      const image = get(
        content,
        ['attributes', 'image', 'data', 'attributes', 'url'],
        '',
      );
      return {
        id,
        name,
        image,
        numberOfEmails: get(emails, 'length'),
      };
    });

    return contents;
  }

  async socialMediaContentsList(queryString: QueryParams | string = '') {
    const query = this.validateQueryString(queryString);
    const pagination = await this.generalListWithPagination(
      ROUTE_SOCIAL_MEDIA_CONTENTS_LIST,
      query,
    );
    const { data } = pagination;
    pagination.data = data.map((content) => {
      const id = content.id;
      const { name, CampaignPost } = content;
      const image = get(content, ['image', 'data', 'attributes', 'url'], '');
      return {
        id,
        name,
        image,
        numberOfTemplates: get(CampaignPost, 'length', 0),
      };
    });

    return pagination;
  }

  async socialMediaContentsDetails(contentId: number) {
    const content = await this.socialMediaContentDetailsRaw(contentId);
    const id = content.id;
    const { name, CampaignPost } = content.attributes;
    const image = get(
      content,
      ['attributes', 'image', 'data', 'attributes', 'url'],
      '',
    );
    return {
      id,
      name,
      image,
      campaignPost: map(CampaignPost, (template) => {
        return {
          id: template.id,
          name: template.name,
          relativeDays: template.relativeDays,
          absoluteDay: template.absoluteDay,
          absoluteMonth: template.absoluteMonth,
          content: get(template, ['template', 'data', 'attributes', 'content']),
          templateName: get(template, [
            'template',
            'data',
            'attributes',
            'name',
            'content',
          ]),
          image: get(template, [
            'template',
            'data',
            'attributes',
            'image',
            'data',
            'attributes',
            'url',
          ]),
          socialMedia: get(template, [
            'template',
            'data',
            'attributes',
            'social_media',
            'socialMedia',
            'data',
            'attributes',
            'name',
          ]),
        };
      }),
    };
  }

  async productPackages(queryString = ''): Promise<ProductPackages[]> {
    return this.generalList(ROUTE_PAYMENT_PLANS, queryString);
  }

  async magazineData({ month, year }: { month: string; year: string }) {
    const populateFields = {
      populate: {
        displayImage: {
          fields: ['name', 'url'],
        },
      },
    };
    const query = {
      populate: {
        pdf: { fields: ['name', 'url'] },
        previewPdf: { fields: ['name', 'url'] },
        frontCoverDesign: populateFields,
        frontCoverStrip: populateFields,
        frontInsideCover: populateFields,
        backInsideCover: populateFields,
        backCover: populateFields,
      },
      filters: {
        month: { $eq: month },
        year: { $eq: year },
      },
    };
    const queryString = `?${CmsPopulateBuilder.build(query)}`;
    return this.generalList<Array<DataObject<ReferralMarketingMagazine>>>(
      ROUTE_REFERRAL_MARKETING_MAGAZINE,
      queryString,
    );
  }

  public async contentDetailsRaw(contentId: number) {
    const query = {
      populate: {
        image: '*',
        emails: {
          populate: {
            template: {
              populate: {
                image: '*',
                emailTemplates: '*',
              },
            },
          },
        },
      },
    };
    const queryString = `?${CmsPopulateBuilder.build(query)}`;
    return this.generalDetails<Content>(
      ROUTE_CONTENTS_DETAILS,
      contentId,
      queryString,
    );
  }

  public socialMediaContentDetailsRaw(contentId: number) {
    const query = {
      populate: {
        image: '*',
        CampaignPost: {
          populate: {
            template: {
              populate: {
                image: '*',
                social_media: { populate: '*' },
              },
            },
          },
        },
      },
    };
    const queryString = `?${CmsPopulateBuilder.build(query)}`;
    return this.generalDetails(
      ROUTE_SOCIAL_MEDIA_CONTENTS_DETAILS,
      contentId,
      queryString,
    );
  }

  public async contentDetails(contentId: number) {
    const content = await this.contentDetailsRaw(contentId);

    const id = content.id;
    const { name, emails } = content.attributes;
    const image = get(
      content,
      ['attributes', 'image', 'data', 'attributes', 'url'],
      '',
    );

    return {
      id,
      name,
      image,
      emails: map(emails, (email) => {
        return {
          id: email.id,
          name: email.name,
          usesRelativeTime: email.usesRelativeTime,
          relativeDays: email.relativeDays,
          absoluteDay: email.absoluteDay,
          absoluteMonth: email.absoluteMonth,
          templateName: get(email, ['template', 'data', 'attributes', 'name']),
          image: get(email, [
            'template',
            'data',
            'attributes',
            'image',
            'data',
            'attributes',
            'url',
          ]),
        };
      }),
    };
  }

  public async allSegmentsExists(ids: number[]): Promise<void> {
    const filterObjects: CmsFilterObject[] = [
      <CmsFilterObject>{
        name: 'id',
        operator: '$in',
        value: ids,
      },
    ];

    const queryString = `?${CmsFilterBuilder.build(filterObjects)}`;
    const data = await this.generalList(ROUTE_SEGMENTS_LIST, queryString);
    const areEqual = get(data, 'length') === get(ids, 'length');
    if (!areEqual) {
      throw new NotFoundException();
    }
  }

  public async createTemplate(
    customer: CustomerDocument,
    templateData: CreateTemplate,
  ): Promise<DataObject<Template>> {
    const data = {
      ...templateData,
      customerId: customer._id,
    };
    return this.generalCreate<DataObject<Template>>(
      ROUTE_TEMPLATES_CREATE,
      data,
    );
  }

  public async updateTemplate(
    templateId,
    templateData: Template,
  ): Promise<DataObject<Template>> {
    const route = replaceRouteParameter(
      ROUTE_TEMPLATES_UPDATE,
      ':id',
      templateId,
    );

    return this.generalUpdate<DataObject<Template>>(route, templateData);
  }

  public async deleteTemplate(templateId) {
    const route = replaceRouteParameter(
      ROUTE_TEMPLATES_DELETE,
      ':id',
      templateId,
    );
    const response = await this.generalDelete(route);
    const { id } = response;
    return {
      id,
    };
  }

  public async magazineDetails(
    magazineId: number,
    route = ROUTE_REFERRAL_MARKETING_MAGAZINE + '/:id',
  ) {
    return this.generalDetails<ReferralMarketingMagazine>(
      route,
      +magazineId,
      '?populate=*',
    );
  }

  public healthCheck() {
    return this.http.get(HEALTH_CHECK);
  }

  private async generalDetails<T = any>(
    route: string,
    entityId: number,
    queryString = '',
  ): Promise<DataObject<T>> {
    const url = replaceRouteParameter(route, ':id', entityId) + queryString;
    const response = await this.http.get(url);
    return <DataObject<T>>get(response, ['data', 'data']);
  }

  private async generalCreate<T = DataObject<any>>(
    route: string,
    data: object,
  ) {
    const response = await this.http.post(route, { data });

    return <T>get(response, ['data', 'data']);
  }

  private async generalUpdate<T = DataObject<any>>(
    route: string,
    data: object,
  ) {
    const response = await this.http.put(route, { data });

    return <T>get(response, ['data', 'data']);
  }

  private async generalDelete(route: string) {
    const response = await this.http.delete(route);

    return get(response, ['data', 'data']);
  }

  /**
   * @deprecated
   * please use generalListWithPagination
   */
  private async generalList<T = any[]>(
    route: string,
    queryString = '',
  ): Promise<T | []> {
    const response = await this.http.get(`${route}${queryString}`);
    const hasData = <number>get(response, ['data', 'data', 'length']);

    if (!hasData) {
      return [];
    }

    return get(response, ['data', 'data']) as T;
  }

  async generalListWithPagination<T = any>(
    route: string,
    query?: QueryParams | string,
  ): Promise<PaginatorSchematicsInterface> {
    const queryString = this.validateQueryString(query);
    const response = await this.http.get<ResponseArrayObject<DataObject<T>>>(
      `${route}${queryString}`,
    );
    const { data, meta } = response.data;

    const mappedData = map(data, (item) => {
      return {
        id: item.id,
        ...item.attributes,
      };
    });

    const total = get(meta, ['pagination', 'total'], 0);
    const perPage = get(meta, ['pagination', 'pageSize']);

    // -1 because mongodb pagination start at 0
    const currentPage = get(meta, ['pagination', 'page']) - 1;

    return PaginatorSchema.build(total, mappedData, currentPage, perPage);
  }

  private validateQueryString(queryString: any): string {
    return typeof queryString === 'string'
      ? queryString
      : `?${CmsPopulateBuilder.build(queryString)}`;
  }

  public async getUpgradePath(
    dto: ChargifyUpgradePathDto,
  ): Promise<ChargifyUpgradePathResponseDto> {
    const ChargifyProductListId: number = await this.configService.get(
      'cms.app_config_chargify_products_list_id',
    );
    return this.getPlans(ChargifyProductListId, dto.bookId);
  }

  public async getPlans(
    ChargifyProductListId: number,
    bookId: string,
  ): Promise<ChargifyUpgradePathResponseDto> {
    const upgradePathDetails = [];
    const data = await this.generalDetails(
      ROUTE_APP_CONFIG,
      ChargifyProductListId,
      '?populate=*',
    );

    const result = get(data, ['attributes', 'value'], []).filter(
      (product) => product.allowedBooks.indexOf(bookId.toString()) !== -1,
    );

    result?.map((plan) => {
      const obj = {
        componentId: plan.id,
        componentName: plan.name,
        productHandle: plan.chargifyProductHandle,
      };
      upgradePathDetails.push(obj);
    });
    return <ChargifyUpgradePathResponseDto>{
      plans: upgradePathDetails,
    };
  }

  public async getSocialMediaTrainingConfig(): Promise<string[]> {
    const response = await this.generalListWithPagination(
      ROUTE_SOCIAL_MEDIA_CONFIG,
      '?filters[key]=afy-ui',
    );
    const appConfig = <AppConfig>first(response.data);
    return appConfig.value.SOCIAL_MEDIA_TRAINING_PLANS;
  }

  public async getUpgradeNowTermsConfig(): Promise<string> {
    try {
      const response = await this.generalListWithPagination(
        ROUTE_SOCIAL_MEDIA_CONFIG,
        '?filters[key]=UPGRADE_TERMS',
      );
      const appConfig = <AppConfig>first(response.data);
      return appConfig.value.html;
    } catch (error) {
      throw new HttpException(
        {
          message: 'failed to load data from CMS',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async getUiConfig(): Promise<AppConfig> {
    const response = await this.generalListWithPagination(
      ROUTE_SOCIAL_MEDIA_CONFIG,
      '?filters[key]=afy-ui',
    );
    return <AppConfig>first(response.data);
  }

  public async getReferralMarketingPlans(): Promise<string[]> {
    const appConfig = await this.getUiConfig();
    return appConfig.value.RMM_MARKETING_PLANS;
  }
}

export class DataObject<T> {
  id: number;
  attributes: T;
}

export class ResponseObject<T> {
  data: DataObject<T>;
  meta: any;
  error: any;
}

export class ResponseArrayObject<T> {
  data: Array<T>;
  meta: {
    pagination?: Pagination;
  };
  error: any;
}

/**
 * Strapi query params for filtering, population, sort, and pagination

 * @Url
 * find more at: https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/filtering-locale-publication.html#filtering
 */
export class QueryParams {
  sort?: string[];
  pagination?: Pagination;
  /**
   * Select only the fields needed
   */
  fields?: string | string[];
  /**
   * use to populate relational fields
   * @example
   * ?populate[0]=seoData&populate[1]=seoData.sharedImage&populate[2]=seoData.sharedImage.media
   */
  populate?: any;
  filters?: any;
  publicationState?: PublicationState;
}

class Pagination {
  page: number;
  pageSize: number;
  pageCount?: number;
  total?: number;
}

export enum PublicationState {
  LIVE = 'live',
  PREVIEW = 'preview',
}

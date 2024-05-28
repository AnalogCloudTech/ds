import { stringify } from 'qs';
import { each } from 'lodash';

const FILTER_FIELD_NAME = 'filters';

enum Operators {
  $eq = '$eq',
  $ne = '$ne',
  $lt = '$lt',
  $lte = '$lte',
  $gt = '$gt',
  $gte = '$gte',
  $in = '$in',
  $notIn = '$notIn',
  $contains = '$contains',
  $notContains = '$notContains',
  $containsi = '$containsi',
  $notContainsi = '$notContainsi',
  $null = '$null',
  $notNull = '$notNull',
  $between = '$between',
  $startsWith = '$startsWith',
  $endsWith = '$endsWith',
  $or = '$or',
  $and = '$and',
}

export type CmsFilterObject = {
  name: string;
  operator: Operators;
  value: string | number | number[] | boolean;
};

export type ResponseSegmentsType = {
  id: number;
  name: string;
};

export type CmsSubQueryObject = {
  operator: Operators;
  value: CmsFilterObject[];
};

export class CmsFilterBuilder {
  static build(filters: CmsFilterObject[]): string {
    const httpFilterQueryString = filters.map((filter: CmsFilterObject) => {
      const { name, operator, value } = filter;
      const url = [];
      if (operator === '$in') {
        each(value as Array<number | string>, (item, key) => {
          url.push(
            `${FILTER_FIELD_NAME}[${name}][${operator}][${key}]=${item}`,
          );
        });
      } else {
        url.push(`${FILTER_FIELD_NAME}[${name}][${operator}]=${value}`);
      }

      return url.join('&');
    });

    return httpFilterQueryString.join('&');
  }

  static buildSubQuery(query: CmsSubQueryObject): string {
    const { operator, value } = query;
    const filterArr = value.map((filter: CmsFilterObject) => {
      const { name, operator, value } = filter;
      return { [name]: { [operator]: value } };
    });
    return stringify({ [FILTER_FIELD_NAME]: { [operator]: filterArr } });
  }
}

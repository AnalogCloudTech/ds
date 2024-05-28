import { stringify } from 'qs';

export class CmsPopulateBuilder {
  static build(queryObject: object): string {
    return stringify(queryObject, {
      encodeValuesOnly: true,
    });
  }
}

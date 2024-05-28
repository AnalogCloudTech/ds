import * as qs from 'qs';

/**
 *
 * @param routeObject : Object containing route of the request,
 *  with the value starting after the controller path.
 *  e.g:
 *  API -->         http://localhost:3000/v1/chargify/components/1824467/price_points.json
 *  routeObject -->  { '0': 'components/1824467/price_points.json' }
 *
 *
 *  @param params : Object containing params passed in the route
 *
 * @returns A string containing route and the params
 */

export function generateUrl(
  routeObject: { [key: string]: string },
  params: object,
): string {
  const route = routeObject[0] ?? '';
  const stringifiedParams = qs.stringify(params);
  const url = `/${route}?${stringifiedParams}`;
  return url;
}

export const paramsStringify = (params: object): string =>
  qs.stringify(params) || '';

/**
 *
 * @param route : string
 * @param param : sting keyword we need to replace
 * @param value : new value for the keyword
 * @returns       A string with keyword replaced by value provided
 */

export function replaceRouteParameter(
  route: string,
  param: string,
  value: string,
): string {
  return route.replace(param, value);
}

/**
 *
 * @param str    : string
 * @param mapObj : Object with
 *  key as the value we need to replace,
 *  value as the new value
 *
 *
 * @returns : string with replaced key with its value of the object passed
 */

export function replaceAll(str: string, mapObj: object) {
  const re = new RegExp(Object.keys(mapObj).join('|'), 'gi');

  return str.replace(re, function (matched) {
    return mapObj[matched.toLowerCase()] as string;
  });
}

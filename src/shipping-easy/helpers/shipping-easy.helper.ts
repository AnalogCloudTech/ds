import { Method } from 'axios';
import { createHmac } from 'crypto';
import { stringify } from 'qs';

export function formatQueryString(queryObject: object): string {
  return stringify(queryObject, {
    encodeValuesOnly: true,
  });
}

export function prepareApiSignature(
  method: Method,
  url: string,
  timestamp: number,
  queryParamObject: object,
  apiKey: string,
  apiSecret: string,
): string {
  const formatedQueryString: string = formatQueryString(queryParamObject);
  const signatureString = `${method.toString()}&${url}&api_key=${apiKey}&api_timestamp=${timestamp}&${formatedQueryString}`;
  const hmac = createHmac('sha256', apiSecret)
    .update(signatureString)
    .digest('hex');
  return hmac;
}

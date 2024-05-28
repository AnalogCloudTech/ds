import { Method } from 'axios';
export declare function formatQueryString(queryObject: object): string;
export declare function prepareApiSignature(method: Method, url: string, timestamp: number, queryParamObject: object, apiKey: string, apiSecret: string): string;

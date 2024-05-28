import { Axios } from 'axios';
import { Method } from '@/internal/utils/request';
export declare class ChargifyService {
    private readonly http;
    constructor(http: Axios);
    passthru<T = any>(url: string, reqMethod: Method, payload: object): Promise<T>;
}

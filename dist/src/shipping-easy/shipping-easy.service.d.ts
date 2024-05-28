import { Axios } from 'axios';
import { SEResponse } from './domain/types';
export declare class ShippingEasyService {
    private readonly http;
    private readonly apiKey;
    private readonly apiSecret;
    constructor(http: Axios, apiKey: string, apiSecret: string);
    getOrders(orderStatus: string, page?: number, perPage?: number): Promise<SEResponse>;
}

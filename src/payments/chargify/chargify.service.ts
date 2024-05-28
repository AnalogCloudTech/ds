import { Axios, AxiosError } from 'axios';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { get } from 'lodash';
import { Method } from '@/internal/utils/request';

type Errors = {
  status: number;
  errors: Array<string>;
};

@Injectable()
export class ChargifyService {
  constructor(@Inject('HTTP_CHARGIFY') private readonly http: Axios) {}

  async passthru<T = any>(url: string, reqMethod: Method, payload: object) {
    try {
      const response = await this.http[reqMethod](url, payload);
      return <T>get(response, 'data');
    } catch (error) {
      if (error instanceof AxiosError) {
        const { response: errorResponse, status } = error as AxiosError;
        throw new HttpException(errorResponse, status);
      }
    }
  }
}

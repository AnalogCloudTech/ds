import { transformResponse } from '@/internal/utils/axiosTranformer/transform.response';
import { transformRequest } from '@/internal/utils/axiosTranformer/transform.request';
import { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

const axiosDefaultsConfig = (
  extraHeaders: RawAxiosRequestHeaders = {},
): AxiosRequestConfig => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...extraHeaders,
    },
    transformResponse: transformResponse,
    transformRequest: transformRequest,
  };
};

export { axiosDefaultsConfig };

import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';

export type UploadParams = {
  bucket: string;
  path: string;
  ext: string;
  contentType: string;
  expiration?: number;
};

export type UploadStreamParams = {
  bucket: string;
  fullPath: string;
  contentType: string;
};


export type UploadParamsWCustomer = UploadParams & {
  customer: CustomerDocument;
};

import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';

export type MarketingParameters = {
  channel?: string;
  utmSource?: string;
  utmMedium?: string;
  utmContent?: string;
  utmTerm?: string;
};

export type SalesParameters = {
  orderSystem?: string;
  salesAgent?: string;
};

export type UpsellCSVJob = {
  formattedData: { [key: string]: string }[];
  customer: CustomerDocument;
  email: string;
  bucket: string;
};

export type FormattedUpsellCSV = {
  'First Name': string;
  'Last Name': string;
  Email: string;
  Offer: string;
  Channel: string;
  'UTM Source': string;
  'UTM Medium': string;
  'UTM Content': string;
  'UTM Term': string;
  'Date of Transaction': string;
};

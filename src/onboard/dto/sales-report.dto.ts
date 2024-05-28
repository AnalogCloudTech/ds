import { OfferDocument } from '../schemas/offer.schema';

export class SalesReportResponseDto {
  SalesDetails: SalesDetails;
}

export class SalesResponseDto {
  SalesDetails: Sales[];
}

export class SalesDetails {
  data: Sales[];
  meta: metaData;
}

export class Sales {
  _id: string;
  createdAt: string;
  updatedAt: string;
  customerInfo: customerInfo;
  offerDetails: offerDetails;
}

export class metaData {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export class customerInfo {
  email: string;
  stripeId: string;
}

export class offerDetails {
  title: string;
  trial: string;
  code: string;
}

export class OfferListReportResponseDto {
  data: OfferDocument[];
  meta: metaData;
}

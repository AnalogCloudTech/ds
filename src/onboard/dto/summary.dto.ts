import { GuideOrderDocument } from '@/guides/orders/schemas/guide-orders.schema';

export class SummaryDTO {
  scheduleData: string;
  yourBook: {
    title: string;
    digitalBook: string;
    bookWebsite: string;
  };
  printedBooks: number;
  shipTo: {
    address: string;
    street: string;
    country: string;
  };
}

export class SummaryGuideDTO {
  scheduleData: string;
  guideOrder: GuideOrderDocument;
  shipTo: {
    address: string;
    street: string;
    country: string;
  };
}

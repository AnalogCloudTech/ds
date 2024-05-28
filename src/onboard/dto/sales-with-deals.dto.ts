export class SalesReportWithDealsResponseDto {
  sales: SalesReportWithDealsLineItem[];
}

export class SalesReportWithDealsLineItem {
  stripeId: string;
  saleDate: string;
  customerEmail: string;
  offerCode: string;
  dealExists: boolean;
}

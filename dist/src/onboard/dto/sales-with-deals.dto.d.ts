export declare class SalesReportWithDealsResponseDto {
    sales: SalesReportWithDealsLineItem[];
}
export declare class SalesReportWithDealsLineItem {
    stripeId: string;
    saleDate: string;
    customerEmail: string;
    offerCode: string;
    dealExists: boolean;
}

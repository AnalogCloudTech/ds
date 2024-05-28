export declare class SalesReportResponseDto {
    SalesDetails: SalesDetails;
}
export declare class SalesResponseDto {
    SalesDetails: Sales[];
}
export declare class SalesDetails {
    data: Sales[];
    meta: metaData;
}
export declare class Sales {
    _id: string;
    createdAt: string;
    updatedAt: string;
    customerInfo: customerInfo;
    offerDetails: offerDetails;
}
export declare class metaData {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
}
export declare class customerInfo {
    email: string;
    stripeId: string;
}
export declare class offerDetails {
    title: string;
    trial: string;
    code: string;
}
